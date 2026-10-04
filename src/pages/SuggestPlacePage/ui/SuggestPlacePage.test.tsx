import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PlaceNamesDocument,
  type PlaceSuggestionInput,
  SubmitPlaceSuggestionDocument,
  UploadPlaceSuggestionPhotoDocument,
} from 'shared/generated/graphql';
import type * as guestModule from 'shared/lib/guest';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { resizeAndConvert } from 'shared/lib/image';
import { setUser, useAuthStore } from 'shared/stores/auth';
import { SuggestPlacePage } from './SuggestPlacePage';

vi.mock('shared/lib/guest', async (importOriginal) => {
  const ensureGuestIdentity = vi.fn();
  return {
    ...(await importOriginal<typeof guestModule>()),
    ensureGuestIdentity,
    contributionCredentials: (isSignedIn: boolean) => (isSignedIn ? Promise.resolve({}) : ensureGuestIdentity()),
  };
});

vi.mock('shared/lib/image', () => ({ resizeAndConvert: vi.fn() }));

const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };
const SUGGESTION_ID = 'suggestion-1';
const DOWNSCALED = 'downscaled';
const DOWNSCALED_BASE64 = btoa(DOWNSCALED);

const signIn = () => {
  setUser({ id: 'user-1', displayName: 'Ada', email: 'ada@example.com', isGoogleUserUserWithoutPassword: false });
};

const placeNamesMock = (names: string[] = []): MockedResponse => ({
  request: { query: PlaceNamesDocument },
  result: {
    data: {
      places: {
        __typename: 'PlacesResponse',
        places: names.map((name, i) => ({
          __typename: 'Place',
          id: `place-${i}`,
          properties: { __typename: 'PlaceProperties', id: `place-${i}`, name },
        })),
      },
    },
  },
});

const submitMock = (
  input: PlaceSuggestionInput,
  credentials: Partial<typeof guest> = {},
  onCall = () => {},
): MockedResponse => ({
  request: { query: SubmitPlaceSuggestionDocument, variables: { input, ...credentials } },
  result: () => {
    onCall();
    return { data: { submitPlaceSuggestion: SUGGESTION_ID } };
  },
});

const failedSubmitMock = (input: PlaceSuggestionInput, code?: string): MockedResponse => ({
  request: { query: SubmitPlaceSuggestionDocument, variables: { input, ...guest } },
  ...(code
    ? { result: { errors: [new GraphQLError('Nope', { extensions: { code } })] } }
    : { error: new Error('Network down') }),
});

/** One `uploadPlaceSuggestionPhoto`, answered or failed with `code`; `onCall` counts what reached the network. */
const uploadMock = (
  { credentials = guest, code, delay }: { credentials?: Partial<typeof guest>; code?: string; delay?: number } = {},
  onCall = () => {},
): MockedResponse => ({
  request: {
    query: UploadPlaceSuggestionPhotoDocument,
    variables: { suggestionId: SUGGESTION_ID, fileBuffer: DOWNSCALED_BASE64, ...credentials },
  },
  delay,
  result: () => {
    onCall();
    return code
      ? { errors: [new GraphQLError('Nope', { extensions: { code } })] }
      : { data: { uploadPlaceSuggestionPhoto: { __typename: 'UploadPlaceSuggestionPhotoResponse', photoCount: 1 } } };
  },
});

const photo = (name: string) => new File(['original'], name, { type: 'image/jpeg' });

const pickPhotos = async (user: ReturnType<typeof userEvent.setup>, files: File[]) => {
  await user.upload(screen.getByLabelText('Add photos of the Place'), files);
};

const renderPage = (mocks: MockedResponse[] = [], names?: string[]) =>
  render(
    <MockedProvider mocks={[placeNamesMock(names), ...mocks]}>
      <MemoryRouter>
        <SuggestPlacePage />
      </MemoryRouter>
    </MockedProvider>,
  );

const field = (label: RegExp) => screen.getByLabelText(label);
const submitButton = () => screen.getByRole('button', { name: /suggest this place/i });

const fillRequired = async (
  user: ReturnType<typeof userEvent.setup>,
  name = 'Kaffee Kiez',
  address = 'Weserstr. 1',
) => {
  await user.type(field(/^name/i), name);
  await user.type(field(/^address/i), address);
};

describe('SuggestPlacePage', () => {
  beforeEach(() => {
    setUser(null);
    vi.mocked(ensureGuestIdentity).mockReset();
    vi.mocked(ensureGuestIdentity).mockResolvedValue(guest);
    vi.mocked(resizeAndConvert).mockResolvedValue(new Blob([DOWNSCALED], { type: 'image/webp' }));
    URL.createObjectURL = vi.fn(() => 'blob:photo');
    URL.revokeObjectURL = vi.fn();
  });

  it('keeps the heading through the thank-you, and the subtext only until submitting', async () => {
    const user = userEvent.setup();
    renderPage([submitMock({ name: 'Kaffee Kiez', address: 'Weserstr. 1' }, guest)]);
    const heading = () => screen.getByRole('heading', { level: 1, name: 'Suggest a Place' });
    const subtext = "Know a good Place that isn't on the map yet? Tell us about it.";

    expect(heading()).toBeInTheDocument();
    expect(screen.getByText(subtext)).toBeInTheDocument();

    await fillRequired(user);
    await user.click(submitButton());

    expect(await screen.findByText(/we usually check suggestions within a couple of days/i)).toBeInTheDocument();
    expect(heading()).toBeInTheDocument();
    expect(screen.queryByText(subtext)).not.toBeInTheDocument();
  });

  describe('validation', () => {
    it('keeps the submit disabled until the name and address are given, with every optional field empty', async () => {
      const user = userEvent.setup();
      renderPage();

      expect(submitButton()).toBeDisabled();
      expect(submitButton()).not.toHaveAttribute('aria-busy');

      await user.type(field(/^name/i), 'Kaffee Kiez');
      expect(submitButton()).toBeDisabled();

      await user.type(field(/^address/i), 'Weserstr. 1');
      await waitFor(() => {
        expect(submitButton()).toBeEnabled();
      });
    });

    it('sends nothing while the submit is disabled', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.type(field(/^name/i), 'Kaffee Kiez');
      expect(submitButton()).toBeDisabled();
      await user.click(submitButton());
      await user.type(field(/^name/i), '{Enter}');

      expect(ensureGuestIdentity).not.toHaveBeenCalled();
      expect(screen.queryByText(/we usually check suggestions/i)).not.toBeInTheDocument();
    });

    it('asks for the name and address as soon as they are cleared', async () => {
      const user = userEvent.setup();
      renderPage();

      await fillRequired(user);
      await user.clear(field(/^name/i));
      expect(await screen.findByText('Name is required')).toBeInTheDocument();

      await user.clear(field(/^address/i));
      expect(await screen.findByText('Address is required')).toBeInTheDocument();
      expect(submitButton()).toBeDisabled();
    });

    it('treats a blank name as missing', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.type(field(/^name/i), '   ');
      await user.type(field(/^address/i), 'Weserstr. 1');

      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(submitButton()).toBeDisabled();
    });

    it('rejects text over the limits as it is pasted, field by field', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.type(field(/^address/i), 'Weserstr. 1');
      await user.click(field(/^name/i));
      await user.paste('n'.repeat(201));
      expect(await screen.findByText('Name must be 200 characters or less')).toBeInTheDocument();

      await user.click(field(/what makes it good/i));
      await user.paste('d'.repeat(501));
      expect(await screen.findByText('Keep it to 500 characters or less')).toBeInTheDocument();
      expect(submitButton()).toBeDisabled();
    });

    it('lets a User, who has no email field, submit with just the name and address', async () => {
      signIn();
      const user = userEvent.setup();
      renderPage();

      await fillRequired(user);

      await waitFor(() => {
        expect(submitButton()).toBeEnabled();
      });
    });

    it("blocks a Guest's email that is not one until it is cleared", async () => {
      const user = userEvent.setup();
      renderPage();

      await fillRequired(user);
      await user.type(field(/^email/i), 'not-an-email');

      expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
      expect(submitButton()).toBeDisabled();

      await user.clear(field(/^email/i));
      await waitFor(() => {
        expect(submitButton()).toBeEnabled();
      });
      expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
    });
  });

  describe('"Is it one of these?"', () => {
    const names = ['The Barn', 'Barn Roastery', 'Bonanza', 'Barnabas Café', 'Barney’s'];

    it('shows up to 3 Places with a matching name, each linking to its page', async () => {
      const user = userEvent.setup();
      renderPage([], names);

      await user.type(field(/^name/i), 'barn');

      const hint = await screen.findByRole('region', { name: /is it one of these/i });
      const links = within(hint).getAllByRole('link');
      expect(links).toHaveLength(3);
      expect(links[0]).toHaveTextContent('The Barn');
      expect(links[0]).toHaveAttribute('href', '/place/place-0');
      expect(within(hint).queryByText('Bonanza')).not.toBeInTheDocument();
    });

    it('matches the way Search does, ignoring accents', async () => {
      const user = userEvent.setup();
      renderPage([], ['Röststätte']);

      await user.type(field(/^name/i), 'rost');

      const hint = await screen.findByRole('region', { name: /is it one of these/i });
      expect(within(hint).getByRole('link', { name: 'Röststätte' })).toBeInTheDocument();
    });

    it('stays hidden until a name matches', async () => {
      const user = userEvent.setup();
      renderPage([], names);

      expect(screen.queryByRole('region', { name: /is it one of these/i })).not.toBeInTheDocument();
      await user.type(field(/^name/i), 'zzz');
      expect(screen.queryByRole('region', { name: /is it one of these/i })).not.toBeInTheDocument();
    });

    it('does not block submitting', async () => {
      const user = userEvent.setup();
      renderPage([submitMock({ name: 'Barn', address: 'Weserstr. 1' }, guest)], names);

      await fillRequired(user, 'Barn');
      await screen.findByRole('region', { name: /is it one of these/i });
      await user.click(submitButton());

      expect(await screen.findByText(/we usually check suggestions within a couple of days/i)).toBeInTheDocument();
    });
  });

  it('lets nobody submit while the session check is still running', () => {
    useAuthStore.setState({ user: null, isAuthLoading: true });
    renderPage();

    expect(submitButton()).toBeDisabled();
    expect(submitButton()).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByLabelText(/^email/i)).not.toBeInTheDocument();
  });

  describe('the Guest email', () => {
    it('is offered to Guests with what it is for', () => {
      renderPage();

      expect(field(/^email/i)).toBeInTheDocument();
      expect(screen.getByText("Only to tell you when it's added")).toBeInTheDocument();
    });

    it('is not offered to Users', () => {
      signIn();
      renderPage();

      expect(screen.queryByLabelText(/^email/i)).not.toBeInTheDocument();
      expect(screen.queryByText("Only to tell you when it's added")).not.toBeInTheDocument();
    });
  });

  describe('submitting', () => {
    it('sends a Guest suggestion with the Guest identity and thanks them, promising an email', async () => {
      const user = userEvent.setup();
      const onCall = vi.fn();
      renderPage([
        submitMock(
          {
            name: 'Kaffee Kiez',
            address: 'Weserstr. 1',
            description: 'Great flat white',
            instagram: '@kaffeekiez',
            email: 'guest@example.com',
          },
          guest,
          onCall,
        ),
      ]);

      await fillRequired(user);
      await user.type(field(/what makes it good/i), '  Great flat white ');
      await user.type(field(/^instagram/i), '@kaffeekiez');
      await user.type(field(/^email/i), 'guest@example.com');
      await user.click(submitButton());

      expect(
        await screen.findByText('Thanks! We usually check suggestions within a couple of days.'),
      ).toBeInTheDocument();
      expect(screen.getByText("We'll email you when it's added.")).toBeInTheDocument();
      expect(ensureGuestIdentity).toHaveBeenCalledTimes(1);
      expect(onCall).toHaveBeenCalledTimes(1);
    });

    it('thanks a Guest who left no email without promising one, and sends no blank fields', async () => {
      const user = userEvent.setup();
      renderPage([submitMock({ name: 'Kaffee Kiez', address: 'Weserstr. 1' }, guest)]);

      await fillRequired(user);
      await user.click(submitButton());

      expect(await screen.findByText(/we usually check suggestions within a couple of days/i)).toBeInTheDocument();
      expect(screen.queryByText("We'll email you when it's added.")).not.toBeInTheDocument();
    });

    it('sends a User suggestion without Guest credentials and promises an email', async () => {
      signIn();
      const user = userEvent.setup();
      renderPage([submitMock({ name: 'Kaffee Kiez', address: 'Weserstr. 1' })]);

      await fillRequired(user);
      await user.click(submitButton());

      expect(await screen.findByText("We'll email you when it's added.")).toBeInTheDocument();
      expect(ensureGuestIdentity).not.toHaveBeenCalled();
    });

    it('shows the daily limit on its own and keeps what was typed', async () => {
      const user = userEvent.setup();
      renderPage([failedSubmitMock({ name: 'Kaffee Kiez', address: 'Weserstr. 1' }, 'RATE_LIMITED')]);

      await fillRequired(user);
      await user.click(submitButton());

      expect(await screen.findByRole('alert')).toHaveTextContent(
        "You've reached today's limit for suggestions. Please try again tomorrow.",
      );
      expect(field(/^name/i)).toHaveValue('Kaffee Kiez');
      expect(field(/^address/i)).toHaveValue('Weserstr. 1');
      expect(submitButton()).toBeEnabled();
    });

    it('shows a generic message on any other failure and keeps what was typed', async () => {
      const user = userEvent.setup();
      renderPage([failedSubmitMock({ name: 'Kaffee Kiez', address: 'Weserstr. 1' })]);

      await fillRequired(user);
      await user.click(submitButton());

      expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't send your suggestion. Please try again.");
      expect(field(/^name/i)).toHaveValue('Kaffee Kiez');
      expect(submitButton()).toBeEnabled();
    });
  });

  describe('photos', () => {
    const required = { name: 'Kaffee Kiez', address: 'Weserstr. 1' };
    const thanks = async () => await screen.findByText(/we usually check suggestions within a couple of days/i);
    const photoList = () => screen.getByRole('list', { name: /photo/i });

    it('shows previews that can be removed before submitting, and uploads only the ones left', async () => {
      const user = userEvent.setup();
      const onUpload = vi.fn();
      renderPage([submitMock(required, guest), uploadMock({}, onUpload)]);

      await fillRequired(user);
      await pickPhotos(user, [photo('front.jpg'), photo('blurry.jpg')]);
      expect(within(photoList()).getAllByRole('img')).toHaveLength(2);

      await user.click(screen.getByRole('button', { name: /remove photo 2: blurry.jpg/i }));
      expect(within(photoList()).getAllByRole('img')).toHaveLength(1);

      await user.click(submitButton());
      await thanks();

      expect(await screen.findByText('Saved')).toBeInTheDocument();
      expect(onUpload).toHaveBeenCalledTimes(1);
    });

    it('takes at most 10', async () => {
      const user = userEvent.setup();
      renderPage();

      await pickPhotos(
        user,
        Array.from({ length: 12 }, (_, i) => photo(`p${i}.jpg`)),
      );

      expect(await screen.findByText("Only 10 more fit; the rest weren't added")).toBeInTheDocument();
      expect(within(photoList()).getAllByRole('img')).toHaveLength(10);
      expect(screen.queryByRole('button', { name: /add more/i })).not.toBeInTheDocument();
    });

    it('uploads them one by one after the suggestion is created, each showing its own state', async () => {
      const user = userEvent.setup();
      renderPage([submitMock(required, guest), uploadMock({ delay: 30 }), uploadMock({ delay: 30 })]);

      await fillRequired(user);
      await pickPhotos(user, [photo('front.jpg'), photo('bar.jpg')]);
      await user.click(submitButton());
      await thanks();

      expect(await screen.findByRole('progressbar', { name: /upload progress for front.jpg/i })).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getAllByText('Saved')).toHaveLength(2);
      });
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it("uploads a User's photos without Guest credentials", async () => {
      signIn();
      const user = userEvent.setup();
      renderPage([submitMock(required), uploadMock({ credentials: {} })]);

      await fillRequired(user);
      await pickPhotos(user, [photo('front.jpg')]);
      await user.click(submitButton());
      await thanks();

      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });

    it('names a failed photo on the thank-you and uploads it again on Retry', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();
      renderPage([
        submitMock(required, guest),
        uploadMock(),
        uploadMock({ code: 'INTERNAL_SERVER_ERROR' }),
        uploadMock({}, onRetry),
      ]);

      await fillRequired(user);
      await pickPhotos(user, [photo('front.jpg'), photo('bar.jpg')]);
      await user.click(submitButton());
      await thanks();

      const failure = await screen.findByRole('alert');
      expect(failure).toHaveTextContent(/bar\.jpg/);
      expect(failure).not.toHaveTextContent(/front\.jpg/);

      await user.click(screen.getByRole('button', { name: 'Retry bar.jpg' }));

      await waitFor(() => {
        expect(screen.getAllByText('Saved')).toHaveLength(2);
      });
      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('gives the Guest photo limit its own message', async () => {
      const user = userEvent.setup();
      renderPage([submitMock(required, guest), uploadMock({ code: 'RATE_LIMITED' })]);

      await fillRequired(user);
      await pickPhotos(user, [photo('front.jpg')]);
      await user.click(submitButton());
      await thanks();

      expect(await screen.findByText('Too many photos for now, try again later')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry front.jpg' })).toBeInTheDocument();
    });

    it('keeps the picked photos when the suggestion itself fails', async () => {
      const user = userEvent.setup();
      const onUpload = vi.fn();
      renderPage([failedSubmitMock(required), uploadMock({}, onUpload)]);

      await fillRequired(user);
      await pickPhotos(user, [photo('front.jpg')]);
      await user.click(submitButton());

      expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't send your suggestion");
      expect(within(photoList()).getAllByRole('img')).toHaveLength(1);
      expect(onUpload).not.toHaveBeenCalled();
    });
  });
});
