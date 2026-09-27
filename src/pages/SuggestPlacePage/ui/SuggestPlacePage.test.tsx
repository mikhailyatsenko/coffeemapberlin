import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlaceNamesDocument, type PlaceSuggestionInput, SubmitPlaceSuggestionDocument } from 'shared/generated/graphql';
import type * as guestModule from 'shared/lib/guest';
import { ensureGuestIdentity } from 'shared/lib/guest';
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

const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };

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
    return { data: { submitPlaceSuggestion: 'suggestion-1' } };
  },
});

const failedSubmitMock = (input: PlaceSuggestionInput, code?: string): MockedResponse => ({
  request: { query: SubmitPlaceSuggestionDocument, variables: { input, ...guest } },
  ...(code
    ? { result: { errors: [new GraphQLError('Nope', { extensions: { code } })] } }
    : { error: new Error('Network down') }),
});

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
  });

  describe('validation', () => {
    it('asks for the name and address on submit and sends nothing', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(submitButton());

      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Address is required')).toBeInTheDocument();
      expect(ensureGuestIdentity).not.toHaveBeenCalled();
    });

    it('treats a blank name as missing', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.type(field(/^name/i), '   ');
      await user.type(field(/^address/i), 'Weserstr. 1');
      await user.click(submitButton());

      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(ensureGuestIdentity).not.toHaveBeenCalled();
    });

    it('rejects text over the limits, field by field', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(field(/^name/i));
      await user.paste('n'.repeat(201));
      await user.click(field(/what makes it good/i));
      await user.paste('d'.repeat(501));
      await user.click(submitButton());

      expect(await screen.findByText('Name must be 200 characters or less')).toBeInTheDocument();
      expect(screen.getByText('Keep it to 500 characters or less')).toBeInTheDocument();
    });

    it('rejects an email that is not one', async () => {
      const user = userEvent.setup();
      renderPage();

      await fillRequired(user);
      await user.type(field(/^email/i), 'not-an-email');
      await user.click(submitButton());

      expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
      expect(ensureGuestIdentity).not.toHaveBeenCalled();
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
});
