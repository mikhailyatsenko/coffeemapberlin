import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/react';
import { type ImagesWrapper } from '../types';

const BASE_URL = process.env.VITE_ENV === 'development' ? 'http://localhost:3000' : 'https://yatsenko.site';

const authenticator = async (signal?: AbortSignal) => {
  try {
    // Perform the request to the upload authentication endpoint.
    const response = await fetch(BASE_URL + '/imagekit/auth', {
      headers: {},
      signal,
    });
    if (!response.ok) {
      // If the server response is not successful, extract the error text for debugging.
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    // Parse and destructure the response JSON for upload credentials.
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    // Log the original error for debugging before rethrowing a new error.
    console.error('Authentication error:', error);
    throw new Error('Authentication request failed');
  }
};

export const handleImgUpload = async (
  imagesWrappers: ImagesWrapper[],
  placeId: string,
  reviewId: string,
  setImagesWrappers: React.Dispatch<React.SetStateAction<ImagesWrapper[]>>,
  setIsImgUploadingProcessing?: React.Dispatch<React.SetStateAction<boolean>>,
  signal?: AbortSignal,
) => {
  if (!imagesWrappers || imagesWrappers.length === 0) {
    console.error('No files to upload');
    return;
  }

  setIsImgUploadingProcessing?.(true);

  try {
    if (signal?.aborted) {
      throw new DOMException('Upload cancelled', 'AbortError');
    }

    const authPromises = imagesWrappers.map(async () => await authenticator(signal));
    const authResults = await Promise.all(authPromises);

    if (signal?.aborted) {
      throw new DOMException('Upload cancelled', 'AbortError');
    }

    const uploadPromises = imagesWrappers.map(async (imageWrapper, i) => {
      const file = imageWrapper.file;
      const { signature, expire, token, publicKey } = authResults[i];

      try {
        await upload({
          expire,
          token,
          signature,
          publicKey,
          file,
          folder: `3welle/review-images/${placeId}/${reviewId}`,
          fileName: `image_${i + 1}.jpg`,
          useUniqueFileName: false,
          onProgress: (event: ProgressEvent) => {
            setImagesWrappers((prev) =>
              prev.map((item, index) =>
                index === i ? { ...item, progress: (event.loaded / event.total) * 100 } : item,
              ),
            );
          },
          abortSignal: signal,
        });
      } catch (error) {
        let errorMessage = 'Upload failed';
        setImagesWrappers([]);
        if (error instanceof ImageKitAbortError) {
          throw new DOMException('Upload cancelled', 'AbortError');
        } else if (error instanceof ImageKitInvalidRequestError) {
          errorMessage = 'Invalid request';
        } else if (error instanceof ImageKitUploadNetworkError) {
          errorMessage = 'Network error';
        } else if (error instanceof ImageKitServerError) {
          errorMessage = 'Server error';
        }
        throw new Error(errorMessage);
      }
    });

    await Promise.all(uploadPromises);
    setIsImgUploadingProcessing?.(false);
  } catch (error) {
    setIsImgUploadingProcessing?.(false);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error('Unexpected error:', error);
    throw error instanceof Error ? error : new Error('Unexpected upload error');
  }
};
