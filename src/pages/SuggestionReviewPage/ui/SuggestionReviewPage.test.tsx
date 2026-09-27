import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import {
  PlaceSuggester,
  PlaceSuggestionForReviewDocument,
  type PlaceSuggestionForReviewQuery,
  PlaceSuggestionStatus,
  PublishPlaceSuggestionDocument,
  type PublishPlaceSuggestionInput,
  RejectPlaceSuggestionDocument,
} from 'shared/generated/graphql';
import { SuggestionReviewPage } from './SuggestionReviewPage';

const ID = 'suggestion-1';
const TOKEN = 'signed-token';
const PLACE_ID = '66f1a2b3c4d5e6f7a8b9c0d1';
const EXISTING_PLACE_ID = '0123456789abcdef01234567';

type Suggestion = PlaceSuggestionForReviewQuery['placeSuggestionForReview'];

const suggestion = (overrides: Partial<Suggestion> = {}): Suggestion => ({
  __typename: 'PlaceSuggestionForReview',
  id: ID,
  name: 'Kaffee Kiez',
  address: 'Weserstr. 1',
  description: 'Great flat white',
  instagram: '@kaffeekiez',
  suggestedBy: PlaceSuggester.guest,
  status: PlaceSuggestionStatus.pending,
  publishedPlaceId: null,
  similarPending: [],
  ...overrides,
});

const reviewMock = (value: Suggestion): MockedResponse => ({
  request: { query: PlaceSuggestionForReviewDocument, variables: { id: ID, token: TOKEN } },
  result: { data: { placeSuggestionForReview: value } },
});

const invalidLinkMock: MockedResponse = {
  request: { query: PlaceSuggestionForReviewDocument, variables: { id: ID, token: TOKEN } },
  result: { errors: [new GraphQLError('This link is not valid', { extensions: { code: 'INVALID_REVIEW_LINK' } })] },
};

const outcome = (status: PlaceSuggestionStatus, publishedPlaceId: string | null = null) => ({
  __typename: 'PlaceSuggestionOutcome',
  status,
  publishedPlaceId,
});

const publishInput = (overrides: Partial<PublishPlaceSuggestionInput> = {}): PublishPlaceSuggestionInput => ({
  name: 'Kaffee Kiez',
  address: 'Weserstr. 1',
  coordinates: { lat: 52.4861, lng: 13.4411 },
  neighborhood: 'Neukölln',
  description: 'Great flat white',
  instagram: '@kaffeekiez',
  ...overrides,
});

const publishMock = (input: PublishPlaceSuggestionInput, onCall = () => {}): MockedResponse => ({
  request: { query: PublishPlaceSuggestionDocument, variables: { id: ID, token: TOKEN, input } },
  result: () => {
    onCall();
    return { data: { publishPlaceSuggestion: outcome(PlaceSuggestionStatus.published, PLACE_ID) } };
  },
});

const duplicatePublishMock = (input: PublishPlaceSuggestionInput): MockedResponse => ({
  request: { query: PublishPlaceSuggestionDocument, variables: { id: ID, token: TOKEN, input } },
  result: {
    errors: [
      new GraphQLError(`This Google Place ID already belongs to a Place: ${EXISTING_PLACE_ID}`, {
        extensions: { code: 'DUPLICATE_GOOGLE_PLACE_ID' },
      }),
    ],
  },
});

const rejectMock = (onCall = () => {}): MockedResponse => ({
  request: { query: RejectPlaceSuggestionDocument, variables: { id: ID, token: TOKEN } },
  result: () => {
    onCall();
    return { data: { rejectPlaceSuggestion: outcome(PlaceSuggestionStatus.rejected) } };
  },
});

const renderPage = (mocks: MockedResponse[], url = `/suggestions/${ID}/review?token=${TOKEN}`) =>
  render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/suggestions/:id/review" element={<SuggestionReviewPage />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );

const field = (label: RegExp) => screen.getByLabelText(label);
const publishButton = () => screen.getByRole('button', { name: /^publish/i });
const rejectButton = () => screen.getByRole('button', { name: /^reject/i });
const waitForForm = async () => await screen.findByRole('button', { name: /^publish/i });

const fillPlace = async (user: ReturnType<typeof userEvent.setup>, coordinates = '52.4861, 13.4411') => {
  await user.click(field(/^coordinates/i));
  await user.paste(coordinates);
  await user.selectOptions(field(/^neighborhood/i), 'Neukölln');
};

describe('SuggestionReviewPage', () => {
  describe('while pending', () => {
    it('shows what was sent, who sent it and similar pending suggestions, with the form prefilled', async () => {
      renderPage([
        reviewMock(
          suggestion({
            suggestedBy: PlaceSuggester.user,
            similarPending: [
              {
                __typename: 'SimilarPlaceSuggestion',
                id: 'other-1',
                name: 'Kaffee Kiez Neukölln',
                address: 'Weserstr. 2',
              },
            ],
          }),
        ),
      ]);

      await waitForForm();
      expect(screen.getByText(/suggested by a user/i)).toBeInTheDocument();
      const sent = screen.getByRole('region', { name: /what was sent/i });
      expect(within(sent).getByText('Great flat white')).toBeInTheDocument();
      expect(within(sent).getByText('@kaffeekiez')).toBeInTheDocument();
      const similar = screen.getByRole('region', { name: /similar pending suggestions/i });
      expect(within(similar).getByText(/Kaffee Kiez Neukölln/)).toBeInTheDocument();
      expect(field(/^name/i)).toHaveValue('Kaffee Kiez');
      expect(field(/^address/i)).toHaveValue('Weserstr. 1');
    });

    it('says a Guest sent it', async () => {
      renderPage([reviewMock(suggestion())]);

      await waitForForm();
      expect(screen.getByText(/suggested by a guest/i)).toBeInTheDocument();
    });

    it('keeps the page out of search engines', async () => {
      renderPage([reviewMock(suggestion())]);

      await waitForForm();
      await vi.waitFor(() =>
        expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'),
      );
    });
  });

  describe('coordinates', () => {
    it.each(['52.4861, 13.4411', '52.4861,13.4411', '  52.4861 ,  13.4411 '])(
      'accepts "%s" and enables Publish',
      async (coordinates) => {
        const user = userEvent.setup();
        renderPage([reviewMock(suggestion())]);
        await waitForForm();

        await fillPlace(user, coordinates);

        expect(publishButton()).toBeEnabled();
      },
    );

    it('rejects text that is not "lat, lng"', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion())]);
      await waitForForm();

      await fillPlace(user, 'Weserstraße');
      await user.tab();

      expect(await screen.findByText(/paste coordinates as "lat, lng"/i)).toBeInTheDocument();
      expect(publishButton()).toBeDisabled();
    });

    it('rejects coordinates outside Berlin, such as swapped ones', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion())]);
      await waitForForm();

      await fillPlace(user, '13.4411, 52.4861');
      await user.tab();

      expect(await screen.findByText(/outside berlin/i)).toBeInTheDocument();
      expect(publishButton()).toBeDisabled();
    });
  });

  describe('Publish', () => {
    it('stays disabled until coordinates and a Neighborhood are set', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion())]);
      await waitForForm();

      expect(publishButton()).toBeDisabled();
      await user.click(field(/^coordinates/i));
      await user.paste('52.4861, 13.4411');
      expect(publishButton()).toBeDisabled();
      await user.selectOptions(field(/^neighborhood/i), 'Neukölln');
      expect(publishButton()).toBeEnabled();
    });

    it('stays disabled while the name or address is blank', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion())]);
      await waitForForm();
      await fillPlace(user);

      await user.clear(field(/^name/i));
      expect(publishButton()).toBeDisabled();
      await user.type(field(/^name/i), 'Kaffee Kiez');
      await user.clear(field(/^address/i));
      expect(publishButton()).toBeDisabled();
    });

    it('lists the twelve Neighborhoods', async () => {
      renderPage([reviewMock(suggestion())]);
      await waitForForm();

      const options = within(field(/^neighborhood/i) as HTMLSelectElement)
        .getAllByRole('option')
        .filter((option) => (option as HTMLOptionElement).value);
      expect(options).toHaveLength(12);
    });

    it('publishes what the form holds only on a press and shows the outcome with a link to the Place', async () => {
      const user = userEvent.setup();
      let published = false;
      renderPage([
        reviewMock(suggestion()),
        publishMock(
          publishInput({
            website: 'https://kaffeekiez.de',
            phone: '+49 30 123',
            googlePlaceId: 'ChIJ123',
          }),
          () => {
            published = true;
          },
        ),
      ]);
      await waitForForm();
      expect(published).toBe(false);

      await fillPlace(user);
      await user.type(field(/^website/i), 'https://kaffeekiez.de');
      await user.type(field(/^phone/i), '+49 30 123');
      await user.type(field(/^google place id/i), 'ChIJ123');
      await user.click(publishButton());

      const status = await screen.findByRole('status');
      expect(published).toBe(true);
      expect(status).toHaveTextContent(/published/i);
      expect(within(status).getByRole('link', { name: /open the place/i })).toHaveAttribute(
        'href',
        `/place/${PLACE_ID}`,
      );
      expect(screen.queryByRole('button', { name: /^publish/i })).not.toBeInTheDocument();
    });

    it('leaves blank optional fields out of the input', async () => {
      const user = userEvent.setup();
      renderPage([
        reviewMock(suggestion({ description: null, instagram: null })),
        publishMock(publishInput({ description: undefined, instagram: undefined })),
      ]);
      await waitForForm();

      await fillPlace(user);
      await user.click(publishButton());

      expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
    });

    it('shows a duplicate Google Place ID with a link to that Place and blocks Publish until the ID changes', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion()), duplicatePublishMock(publishInput({ googlePlaceId: 'ChIJtaken' }))]);
      await waitForForm();

      await fillPlace(user);
      await user.type(field(/^google place id/i), 'ChIJtaken');
      await user.click(publishButton());

      const alert = await screen.findByRole('alert');
      expect(alert).toHaveTextContent(/already belongs to a place/i);
      expect(within(alert).getByRole('link')).toHaveAttribute('href', `/place/${EXISTING_PLACE_ID}`);
      expect(publishButton()).toBeDisabled();

      await user.type(field(/^google place id/i), '2');
      expect(publishButton()).toBeEnabled();
    });
  });

  describe('Reject', () => {
    it('rejects on a button press and shows the outcome', async () => {
      const user = userEvent.setup();
      let rejected = false;
      renderPage([
        reviewMock(suggestion()),
        rejectMock(() => {
          rejected = true;
        }),
      ]);
      await waitForForm();
      expect(rejected).toBe(false);

      await user.click(rejectButton());

      expect(await screen.findByRole('status')).toHaveTextContent(/rejected/i);
      expect(rejected).toBe(true);
      expect(screen.queryByRole('button', { name: /^reject/i })).not.toBeInTheDocument();
    });
  });

  describe('decided and invalid links', () => {
    it('shows only the outcome of a published suggestion', async () => {
      renderPage([reviewMock(suggestion({ status: PlaceSuggestionStatus.published, publishedPlaceId: PLACE_ID }))]);

      const status = await screen.findByRole('status');
      expect(status).toHaveTextContent(/published/i);
      expect(within(status).getByRole('link', { name: /open the place/i })).toHaveAttribute(
        'href',
        `/place/${PLACE_ID}`,
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/^coordinates/i)).not.toBeInTheDocument();
    });

    it('shows only the outcome of a rejected suggestion', async () => {
      renderPage([reviewMock(suggestion({ status: PlaceSuggestionStatus.rejected }))]);

      expect(await screen.findByRole('status')).toHaveTextContent(/rejected/i);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('says a link with a bad token is not valid', async () => {
      renderPage([invalidLinkMock]);

      expect(await screen.findByText('This link is not valid')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('says a link without a token is not valid', async () => {
      renderPage([], `/suggestions/${ID}/review`);

      expect(await screen.findByText('This link is not valid')).toBeInTheDocument();
    });
  });
});
