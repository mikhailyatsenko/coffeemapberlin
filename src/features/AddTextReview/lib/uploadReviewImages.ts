import { client } from 'shared/config/apolloClient';
import { UploadReviewImageDocument, type UploadReviewImageMutation } from 'shared/generated/graphql';
import { type GuestIdentity } from 'shared/lib/guest';
import { type ImagesWrapper } from '../types';

/**
 * Uploads review photos through our own server, one mutation per file.
 *
 * ImageKit's browser upload signature covers only token+expire, so a folder can
 * never be pinned down client-side; sending the bytes to our server is the only
 * way the path and the file names stay ours. The server also owns the image
 * counter, so a run that stops halfway leaves a review with fewer photos rather
 * than a review whose counter points at files that were never uploaded.
 */

const CHUNK_SIZE = 0x8000;

const fileToBase64 = async (file: File): Promise<string> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';

  // Chunked so a large photo does not blow the argument limit of String.apply.
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }

  return btoa(binary);
};

export const uploadReviewImages = async (
  imagesWrappers: ImagesWrapper[],
  reviewId: string,
  guestCredentials: Partial<GuestIdentity>,
  setImagesWrappers: React.Dispatch<React.SetStateAction<ImagesWrapper[]>>,
  setIsImgUploadingProcessing?: React.Dispatch<React.SetStateAction<boolean>>,
  signal?: AbortSignal,
) => {
  if (!imagesWrappers || imagesWrappers.length === 0) {
    return;
  }

  setIsImgUploadingProcessing?.(true);

  try {
    // Sequential on purpose: progress is per file now, and the server assigns
    // image_1, image_2, ... in the order it accepts them.
    for (let i = 0; i < imagesWrappers.length; i += 1) {
      if (signal?.aborted) {
        throw new DOMException('Upload cancelled', 'AbortError');
      }

      const fileBuffer = await fileToBase64(imagesWrappers[i].file);

      await client.mutate<UploadReviewImageMutation>({
        mutation: UploadReviewImageDocument,
        variables: { reviewId, fileBuffer, ...guestCredentials },
        context: { fetchOptions: { signal } },
      });

      setImagesWrappers((prev) => prev.map((item, index) => (index === i ? { ...item, progress: 100 } : item)));
    }

    setIsImgUploadingProcessing?.(false);
  } catch (error) {
    setIsImgUploadingProcessing?.(false);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    console.error('Review image upload failed:', error);
    throw error instanceof Error ? error : new Error('Unexpected upload error');
  }
};
