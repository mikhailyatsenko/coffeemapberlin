import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddTextReviewDocument, UploadReviewImageDocument } from 'shared/generated/graphql';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { resizeAndConvert } from 'shared/lib/image';
import { setUser } from 'shared/stores/auth';
import { AddTextReviewForm } from './AddTextReviewForm';

vi.mock('shared/lib/guest', () => ({ ensureGuestIdentity: vi.fn() }));
// jsdom has no createImageBitmap or canvas, so the downscale is replaced by a stand-in.
vi.mock('shared/lib/image', () => ({ resizeAndConvert: vi.fn() }));

const placeId = 'place-1';
const reviewId = 'review-1';
const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };
const text = 'Great flat white';
const DOWNSCALED = 'downscaled';
const DOWNSCALED_BASE64 = btoa(DOWNSCALED);
const UNREADABLE = "This photo couldn't be read, try a JPEG or PNG";

const addTextReviewMock = (): MockedResponse => ({
  request: { query: AddTextReviewDocument, variables: { placeId, text, ...guest } },
  result: { data: { addTextReview: { __typename: 'AddTextReviewResponse', reviewId, text } } },
});

/** One answered `uploadReviewImage`; `onCall` counts what reached the network. */
const uploadMock = (onCall: () => void): MockedResponse => ({
  request: { query: UploadReviewImageDocument, variables: { reviewId, fileBuffer: DOWNSCALED_BASE64, ...guest } },
  result: () => {
    onCall();
    return { data: { uploadReviewImage: { __typename: 'UploadReviewImageResponse', reviewImages: 1 } } };
  },
});

const photo = (name: string) => new File(['original'], name, { type: 'image/jpeg' });

const renderForm = (existingPhotoCount: number, mocks: MockedResponse[]) =>
  render(
    <MockedProvider mocks={mocks}>
      <AddTextReviewForm placeId={placeId} existingPhotoCount={existingPhotoCount} />
    </MockedProvider>,
  );

const pickPhotos = async (files: File[]) => {
  await userEvent.upload(screen.getByLabelText('Upload images for review'), files);
};

const submitReview = async () => {
  await userEvent.type(screen.getByRole('textbox', { name: /write your review/i }), text);
  await userEvent.click(screen.getByRole('button', { name: 'Submit review' }));
};

beforeEach(() => {
  vi.clearAllMocks();
  setUser(null);
  vi.mocked(ensureGuestIdentity).mockResolvedValue(guest);
  vi.mocked(resizeAndConvert).mockResolvedValue(new Blob([DOWNSCALED], { type: 'image/webp' }));
  URL.createObjectURL = vi.fn(() => 'blob:photo');
  URL.revokeObjectURL = vi.fn();
});

describe('AddTextReviewForm Photos', () => {
  it("counts the Review's existing Photos in the limit", async () => {
    const uploaded = vi.fn();
    renderForm(8, [addTextReviewMock(), uploadMock(uploaded), uploadMock(uploaded)]);

    await pickPhotos([photo('a.jpg'), photo('b.jpg'), photo('c.jpg')]);

    expect(await screen.findByText('You can add 2 more')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(2);

    await submitReview();

    await waitFor(() => {
      expect(uploaded).toHaveBeenCalledTimes(2);
    });
  });

  it('marks an unreadable file on its own thumbnail and uploads the others', async () => {
    vi.mocked(resizeAndConvert).mockImplementation(async (file: File) => {
      if (file.name === 'b.heic') throw new Error('The source image cannot be decoded.');
      return new Blob([DOWNSCALED], { type: 'image/webp' });
    });
    const uploaded = vi.fn();
    renderForm(0, [addTextReviewMock(), uploadMock(uploaded), uploadMock(uploaded), uploadMock(uploaded)]);

    await pickPhotos([photo('a.jpg'), photo('b.heic'), photo('c.jpg')]);

    expect(await screen.findByText(UNREADABLE)).toBeInTheDocument();
    expect(screen.getAllByText(UNREADABLE)).toHaveLength(1);
    expect(screen.getAllByRole('img')).toHaveLength(3);

    await submitReview();

    await waitFor(() => {
      expect(uploaded).toHaveBeenCalledTimes(2);
    });
    // Give a third upload, which must not happen, the chance to reach the network.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(uploaded).toHaveBeenCalledTimes(2);
  });
});
