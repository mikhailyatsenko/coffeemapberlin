import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DeletePlaceSuggestionPhotoDocument,
  FindGoogleIdsForSuggestionDocument,
  type FindGoogleIdsForSuggestionQuery,
  PlaceSuggester,
  PlaceSuggestionForReviewDocument,
  type PlaceSuggestionForReviewQuery,
  PlaceSuggestionStatus,
  PublishPlaceSuggestionDocument,
  type PublishPlaceSuggestionInput,
  RejectPlaceSuggestionDocument,
  UploadPlaceSuggestionPhotoAsAdminDocument,
} from 'shared/generated/graphql';
import { resizeAndConvert } from 'shared/lib/image';
import { SuggestionReviewPage } from './SuggestionReviewPage';

vi.mock('shared/lib/image', () => ({ resizeAndConvert: vi.fn() }));

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
  photos: [],
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
  photoPaths: [],
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

type CandidateResult = FindGoogleIdsForSuggestionQuery['findGoogleIdsForSuggestion'][number];

const candidate = (googleId: string, existingPlaceId: string | null = null): CandidateResult => ({
  __typename: 'GoogleIdCandidate',
  googleId,
  existingPlaceId,
});

const findGoogleIdsMock = (candidates: CandidateResult[]): MockedResponse => ({
  request: { query: FindGoogleIdsForSuggestionDocument, variables: { id: ID, token: TOKEN } },
  result: { data: { findGoogleIdsForSuggestion: candidates } },
});

const failedFindGoogleIdsMock: MockedResponse = {
  request: { query: FindGoogleIdsForSuggestionDocument, variables: { id: ID, token: TOKEN } },
  result: {
    errors: [new GraphQLError('Google lookup failed', { extensions: { code: 'GOOGLE_LOOKUP_FAILED' } })],
  },
};

const DOWNSCALED = 'downscaled';
const DOWNSCALED_BASE64 = btoa(DOWNSCALED);

/** One `uploadPlaceSuggestionPhotoAsAdmin`, storing `path` or failing with `code`; `onCall` counts what reached the network. */
const adminUploadMock = (
  { path, code, delay }: { path?: string; code?: string; delay?: number },
  onCall = () => {},
): MockedResponse => ({
  request: {
    query: UploadPlaceSuggestionPhotoAsAdminDocument,
    variables: { id: ID, token: TOKEN, fileBuffer: DOWNSCALED_BASE64 },
  },
  delay,
  result: () => {
    onCall();
    return code
      ? { errors: [new GraphQLError('Nope', { extensions: { code } })] }
      : { data: { uploadPlaceSuggestionPhotoAsAdmin: path } };
  },
});

/** One `deletePlaceSuggestionPhoto` of `path`, confirmed or failed; `onCall` counts what reached the network. */
const deletePhotoMock = (path: string, { fails = false } = {}, onCall = () => {}): MockedResponse => ({
  request: { query: DeletePlaceSuggestionPhotoDocument, variables: { id: ID, token: TOKEN, path } },
  result: () => {
    onCall();
    return fails
      ? { errors: [new GraphQLError('Nope', { extensions: { code: 'INTERNAL_SERVER_ERROR' } })] }
      : { data: { deletePlaceSuggestionPhoto: true } };
  },
});

const photoFile = (name: string) => new File(['original'], name, { type: 'image/jpeg' });

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
const findOnGoogleButton = () => screen.getByRole('button', { name: /find on google/i });
const waitForForm = async () => await screen.findByRole('button', { name: /^publish/i });

const fillPlace = async (user: ReturnType<typeof userEvent.setup>, coordinates = '52.4861, 13.4411') => {
  await user.click(field(/^coordinates/i));
  await user.paste(coordinates);
  await user.selectOptions(field(/^neighborhood/i), 'Neukölln');
};

describe('SuggestionReviewPage', () => {
  beforeEach(() => {
    vi.mocked(resizeAndConvert).mockResolvedValue(new Blob([DOWNSCALED], { type: 'image/webp' }));
    URL.createObjectURL = vi.fn(() => 'blob:photo');
    URL.revokeObjectURL = vi.fn();
  });

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

  describe('photos', () => {
    const PHOTOS = [
      '/place-suggestions/suggestion-1/a.jpg',
      '/place-suggestions/suggestion-1/b.jpg',
      '/place-suggestions/suggestion-1/c.jpg',
    ];

    const photoList = () => screen.getByRole('list', { name: /photos to publish/i });

    it('shows the photos in upload order, the first marked as the card image', async () => {
      renderPage([reviewMock(suggestion({ photos: PHOTOS }))]);
      await waitForForm();

      const images = within(photoList()).getAllByRole('img');
      expect(images.map((image) => image.getAttribute('src'))).toEqual(
        PHOTOS.map((path) => expect.stringContaining(path) as string),
      );
      expect(images[0]).toHaveAccessibleName(/card image/i);
      expect(images[1]).not.toHaveAccessibleName(/card image/i);
    });

    it('publishes all photos when none is removed', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion({ photos: PHOTOS })), publishMock(publishInput({ photoPaths: PHOTOS }))]);
      await waitForForm();

      await fillPlace(user);
      await user.click(publishButton());

      expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
    });

    const photoItem = (position: number) => within(photoList()).getAllByRole('listitem')[position - 1];

    it('asks Delete/Cancel on the photo, and Cancel keeps it without asking the server', async () => {
      const user = userEvent.setup();
      let deleted = false;
      renderPage([
        reviewMock(suggestion({ photos: PHOTOS })),
        deletePhotoMock(PHOTOS[1], {}, () => {
          deleted = true;
        }),
      ]);
      await waitForForm();

      await user.click(screen.getByRole('button', { name: /^delete photo 2$/i }));
      const confirm = within(photoItem(2)).getByRole('group', { name: /delete photo 2\?/i });
      await user.click(within(confirm).getByRole('button', { name: /cancel/i }));

      expect(within(photoList()).getAllByRole('img')).toHaveLength(3);
      expect(within(photoItem(2)).queryByRole('group')).not.toBeInTheDocument();
      expect(deleted).toBe(false);
    });

    it('erases a deleted photo on the server, the next one becomes the card image and Publish leaves it out', async () => {
      const user = userEvent.setup();
      renderPage([
        reviewMock(suggestion({ photos: PHOTOS })),
        deletePhotoMock(PHOTOS[0]),
        publishMock(publishInput({ photoPaths: [PHOTOS[1], PHOTOS[2]] })),
      ]);
      await waitForForm();

      await user.click(screen.getByRole('button', { name: /^delete photo 1$/i }));
      await user.click(within(photoItem(1)).getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(within(photoList()).getAllByRole('img')).toHaveLength(2);
      });
      const images = within(photoList()).getAllByRole('img');
      expect(images[0]).toHaveAttribute('src', expect.stringContaining(PHOTOS[1]));
      expect(images[0]).toHaveAccessibleName(/card image/i);

      await fillPlace(user);
      await user.click(publishButton());

      expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
    });

    it('keeps a photo whose delete failed and says so', async () => {
      const user = userEvent.setup();
      renderPage([
        reviewMock(suggestion({ photos: PHOTOS })),
        deletePhotoMock(PHOTOS[1], { fails: true }),
        publishMock(publishInput({ photoPaths: PHOTOS })),
      ]);
      await waitForForm();

      await user.click(screen.getByRole('button', { name: /^delete photo 2$/i }));
      await user.click(within(photoItem(2)).getByRole('button', { name: /^delete$/i }));

      expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't delete the photo/i);
      expect(within(photoList()).getAllByRole('img')).toHaveLength(3);

      await fillPlace(user);
      await user.click(publishButton());

      expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
    });

    it('publishes with no photos once all are deleted, keeping the default card image', async () => {
      const user = userEvent.setup();
      renderPage([
        reviewMock(suggestion({ photos: [PHOTOS[0]] })),
        deletePhotoMock(PHOTOS[0]),
        publishMock(publishInput({ photoPaths: [] })),
      ]);
      await waitForForm();

      await user.click(screen.getByRole('button', { name: /^delete photo 1$/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));

      expect(await screen.findByText(/no photos, the place keeps the default card image/i)).toBeInTheDocument();

      await fillPlace(user);
      await user.click(publishButton());

      expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
    });

    it('"Make card image" moves a photo to the front and Publish sends that order', async () => {
      const user = userEvent.setup();
      renderPage([
        reviewMock(suggestion({ photos: PHOTOS })),
        publishMock(publishInput({ photoPaths: [PHOTOS[2], PHOTOS[0], PHOTOS[1]] })),
      ]);
      await waitForForm();
      expect(screen.queryByRole('button', { name: /make photo 1 the card image/i })).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /make photo 3 the card image/i }));

      const images = within(photoList()).getAllByRole('img');
      expect(images[0]).toHaveAttribute('src', expect.stringContaining(PHOTOS[2]));
      expect(images[0]).toHaveAccessibleName(/card image/i);
      expect(images[1]).not.toHaveAccessibleName(/card image/i);

      await fillPlace(user);
      await user.click(publishButton());

      expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
    });

    describe("the admin's own photos", () => {
      const ADMIN_PHOTO = '/place-suggestions/suggestion-1/admin.jpg';

      const pickPhotos = async (user: ReturnType<typeof userEvent.setup>, files: File[]) => {
        await user.upload(screen.getByLabelText(/add place photos/i), files);
      };

      it('uploads a picked photo at once, adds it to the end of the list and publishes it', async () => {
        const user = userEvent.setup();
        renderPage([
          reviewMock(suggestion({ photos: [PHOTOS[0]] })),
          adminUploadMock({ path: ADMIN_PHOTO }),
          publishMock(publishInput({ photoPaths: [PHOTOS[0], ADMIN_PHOTO] })),
        ]);
        await waitForForm();

        await pickPhotos(user, [photoFile('front.jpg')]);

        await waitFor(() => {
          expect(within(photoList()).getAllByRole('img')).toHaveLength(2);
        });
        const images = within(photoList()).getAllByRole('img');
        expect(images[1]).toHaveAttribute('src', expect.stringContaining(ADMIN_PHOTO));

        await fillPlace(user);
        await user.click(publishButton());

        expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
      });
      it('shows each upload in progress, keeps Publish disabled until it settles', async () => {
        const user = userEvent.setup();
        renderPage([reviewMock(suggestion()), adminUploadMock({ path: ADMIN_PHOTO, delay: 50 })]);
        await waitForForm();
        await fillPlace(user);

        await pickPhotos(user, [photoFile('front.jpg')]);

        expect(await screen.findByRole('progressbar', { name: /upload progress for front.jpg/i })).toBeInTheDocument();
        expect(publishButton()).toBeDisabled();
        await waitFor(() => {
          expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
        expect(publishButton()).toBeEnabled();
      });

      it('marks a failed upload, leaves it out of Publish and uploads it again on Retry', async () => {
        const user = userEvent.setup();
        let retried = false;
        renderPage([
          reviewMock(suggestion({ photos: [PHOTOS[0]] })),
          adminUploadMock({ code: 'INTERNAL_SERVER_ERROR' }),
          publishMock(publishInput({ photoPaths: [PHOTOS[0]] })),
          adminUploadMock({ path: ADMIN_PHOTO }, () => {
            retried = true;
          }),
        ]);
        await waitForForm();
        await fillPlace(user);

        await pickPhotos(user, [photoFile('front.jpg')]);

        const retry = await screen.findByRole('button', { name: /retry front.jpg/i });
        expect(screen.getByText(/couldn't save that/i)).toBeInTheDocument();
        expect(publishButton()).toBeEnabled();

        await user.click(retry);

        await waitFor(() => {
          expect(retried).toBe(true);
        });
        await waitFor(() => {
          expect(within(photoList()).getAllByRole('img')[1]).toHaveAttribute(
            'src',
            expect.stringContaining(ADMIN_PHOTO),
          );
        });
        expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
      });

      it('publishes without a photo that failed to upload', async () => {
        const user = userEvent.setup();
        renderPage([
          reviewMock(suggestion({ photos: [PHOTOS[0]] })),
          adminUploadMock({ code: 'INTERNAL_SERVER_ERROR' }),
          publishMock(publishInput({ photoPaths: [PHOTOS[0]] })),
        ]);
        await waitForForm();
        await fillPlace(user);

        await pickPhotos(user, [photoFile('front.jpg')]);
        await screen.findByRole('button', { name: /retry front.jpg/i });
        await user.click(publishButton());

        expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
      });

      it('offers only the slots left and uploads just the first photos of an over-pick', async () => {
        const user = userEvent.setup();
        const stored = Array.from({ length: 8 }, (_, i) => `/place-suggestions/suggestion-1/${i}.jpg`);
        let uploads = 0;
        const countUpload = () => {
          uploads += 1;
        };
        renderPage([
          reviewMock(suggestion({ photos: stored })),
          adminUploadMock({ path: '/place-suggestions/suggestion-1/x.jpg' }, countUpload),
          adminUploadMock({ path: '/place-suggestions/suggestion-1/y.jpg' }, countUpload),
          adminUploadMock({ path: '/place-suggestions/suggestion-1/z.jpg' }, countUpload),
        ]);
        await waitForForm();
        expect(screen.getByRole('button', { name: /add photos \(up to 2\)/i })).toBeInTheDocument();

        await pickPhotos(user, [photoFile('x.jpg'), photoFile('y.jpg'), photoFile('z.jpg')]);

        expect(await screen.findByText(/only 2 more fit; the rest weren't added/i)).toBeInTheDocument();
        await waitFor(() => {
          expect(within(photoList()).getAllByRole('img')).toHaveLength(10);
        });
        expect(uploads).toBe(2);
        expect(screen.getByText('10 photos, the most allowed. Delete one to add another')).toBeInTheDocument();
        expect(screen.queryByLabelText(/add place photos/i)).not.toBeInTheDocument();
      });

      it('replaces the picker with a note at 10 photos, and a delete brings it back', async () => {
        const user = userEvent.setup();
        const stored = Array.from({ length: 10 }, (_, i) => `/place-suggestions/suggestion-1/${i}.jpg`);
        renderPage([reviewMock(suggestion({ photos: stored })), deletePhotoMock(stored[0])]);
        await waitForForm();

        expect(screen.getByText('10 photos, the most allowed. Delete one to add another')).toBeInTheDocument();
        expect(screen.queryByLabelText(/add place photos/i)).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /^delete photo 1$/i }));
        await user.click(screen.getByRole('button', { name: /^delete$/i }));

        expect(await screen.findByRole('button', { name: /add photos \(up to 1\)/i })).toBeInTheDocument();
      });
    });

    it('says when no photos were sent', async () => {
      renderPage([reviewMock(suggestion())]);
      await waitForForm();

      expect(screen.getByText(/no photos, the place keeps the default card image/i)).toBeInTheDocument();
    });
  });

  describe('Find on Google', () => {
    it('asks Google only on a press and lists each candidate as a Google Maps link', async () => {
      const user = userEvent.setup();
      renderPage([
        reviewMock(suggestion()),
        findGoogleIdsMock([candidate('ChIJfree'), candidate('ChIJtaken', PLACE_ID)]),
      ]);
      await waitForForm();
      expect(screen.queryByRole('list', { name: /google candidates/i })).not.toBeInTheDocument();

      await user.click(findOnGoogleButton());

      const list = await screen.findByRole('list', { name: /google candidates/i });
      const [free, taken] = within(list).getAllByRole('listitem');
      const freeLink = within(free).getByRole('link', { name: 'ChIJfree' });
      expect(freeLink).toHaveAttribute('href', 'https://www.google.com/maps/place/?q=place_id:ChIJfree');
      expect(freeLink).toHaveAttribute('target', '_blank');
      expect(within(free).getByRole('button', { name: /use/i })).toBeInTheDocument();
      expect(within(free).queryByText(/already on the map/i)).not.toBeInTheDocument();

      expect(within(taken).getByRole('link', { name: 'ChIJtaken' })).toHaveAttribute(
        'href',
        'https://www.google.com/maps/place/?q=place_id:ChIJtaken',
      );
      expect(within(taken).getByText(/already on the map/i)).toBeInTheDocument();
      expect(within(taken).getByRole('link', { name: /open that place/i })).toHaveAttribute(
        'href',
        `/place/${PLACE_ID}`,
      );
      expect(within(taken).queryByRole('button', { name: /use/i })).not.toBeInTheDocument();
    });

    it('"Use" puts the ID into the Google Place ID field, and Publish sends it', async () => {
      const user = userEvent.setup();
      renderPage([
        reviewMock(suggestion()),
        findGoogleIdsMock([candidate('ChIJfree')]),
        publishMock(publishInput({ googlePlaceId: 'ChIJfree' })),
      ]);
      await waitForForm();
      await fillPlace(user);

      await user.click(findOnGoogleButton());
      await user.click(await screen.findByRole('button', { name: /use/i }));

      expect(field(/^google place id/i)).toHaveValue('ChIJfree');
      await user.click(publishButton());
      expect(await screen.findByRole('status')).toHaveTextContent(/published/i);
    });

    it('keeps Publish disabled while the field holds an ID that belongs to a Place', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion()), findGoogleIdsMock([candidate('ChIJtaken', PLACE_ID)])]);
      await waitForForm();
      await fillPlace(user);
      await user.click(findOnGoogleButton());
      await screen.findByRole('list', { name: /google candidates/i });

      await user.type(field(/^google place id/i), 'ChIJtaken');

      expect(publishButton()).toBeDisabled();
      expect(screen.getByRole('alert')).toHaveTextContent(/already belongs to a place/i);
      await user.type(field(/^google place id/i), '2');
      expect(publishButton()).toBeEnabled();
    });

    it('says Google found nothing and Publish works without an ID', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion()), findGoogleIdsMock([])]);
      await waitForForm();
      await fillPlace(user);

      await user.click(findOnGoogleButton());

      expect(await screen.findByText(/google found nothing, you can publish without it/i)).toBeInTheDocument();
      expect(publishButton()).toBeEnabled();
    });

    it('says when the lookup failed', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion()), failedFindGoogleIdsMock]);
      await waitForForm();

      await user.click(findOnGoogleButton());

      expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't ask google/i);
    });

    it('drops the earlier candidates when a later lookup fails', async () => {
      const user = userEvent.setup();
      renderPage([
        reviewMock(suggestion()),
        findGoogleIdsMock([candidate('ChIJtaken', PLACE_ID)]),
        failedFindGoogleIdsMock,
      ]);
      await waitForForm();
      await fillPlace(user);
      await user.type(field(/^google place id/i), 'ChIJtaken');
      await user.click(findOnGoogleButton());
      await screen.findByRole('list', { name: /google candidates/i });
      expect(publishButton()).toBeDisabled();

      await user.click(findOnGoogleButton());

      expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't ask google/i);
      expect(screen.queryByRole('list', { name: /google candidates/i })).not.toBeInTheDocument();
      expect(publishButton()).toBeEnabled();
    });

    it('shows the button as busy while Google is asked', async () => {
      const user = userEvent.setup();
      renderPage([reviewMock(suggestion()), { ...findGoogleIdsMock([]), delay: 50 }]);
      await waitForForm();

      await user.click(findOnGoogleButton());

      expect(findOnGoogleButton()).toHaveAttribute('aria-busy', 'true');
      expect(await screen.findByText(/google found nothing/i)).toBeInTheDocument();
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
