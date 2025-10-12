import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/react';
import { type ImagesWrapper } from '../types';

const BASE_URL = process.env.VITE_ENV === 'development' ? 'http://localhost:3000' : 'https://yatsenko.site/';

const authenticator = async () => {
  try {
    // Perform the request to the upload authentication endpoint.
    const response = await fetch(BASE_URL + '/imagekit/auth', {
      headers: {},
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
) => {
  const abortController = new AbortController();

  if (!imagesWrappers || imagesWrappers.length === 0) {
    console.error('No files to upload');
    return;
  }

  // Set loading state to true and reset progress
  setIsImgUploadingProcessing?.(true);

  try {
    // Get all authentication tokens upfront for parallel uploads
    const authPromises = imagesWrappers.map(async () => await authenticator());
    const authResults = await Promise.allSettled(authPromises);

    // Upload all images in parallel
    const uploadPromises = imagesWrappers.map(async (imageWrapper, i) => {
      const file = imageWrapper.file;
      const authResult = authResults[i];

      // Check if authentication was successful
      if (authResult.status === 'rejected') {
        console.error('Failed to authenticate for upload:', authResult.reason);
        setImagesWrappers((prev) =>
          prev.map((item, index) => (index === i ? { ...item, error: 'Authentication failed' } : item)),
        );
        return;
      }

      const { signature, expire, token, publicKey } = authResult.value;

      try {
        await upload({
          // Authentication parameters
          expire,
          token,
          signature,
          publicKey,
          file,
          folder: `3welle/review-images/${placeId}/${reviewId}`,
          fileName: `image_${i + 1}.jpg`, // Optionally set a custom file name
          useUniqueFileName: false,
          // Progress callback to update upload progress state
          onProgress: (event: ProgressEvent) => {
            setImagesWrappers((prev) =>
              prev.map((item, index) =>
                index === i ? { ...item, progress: (event.loaded / event.total) * 100 } : item,
              ),
            );
          },
          // Abort signal to allow cancellation of the upload if needed.
          abortSignal: abortController.signal,
        });
      } catch (error) {
        // Handle specific error types provided by the ImageKit SDK.
        let errorMessage = 'Upload failed';

        if (error instanceof ImageKitAbortError) {
          console.error('Upload aborted:', error.reason);
          errorMessage = 'Upload was cancelled';
        } else if (error instanceof ImageKitInvalidRequestError) {
          console.error('Invalid request:', error.message);
          errorMessage = 'Invalid request';
        } else if (error instanceof ImageKitUploadNetworkError) {
          console.error('Network error:', error.message);
          errorMessage = 'Network error';
        } else if (error instanceof ImageKitServerError) {
          console.error('Server error:', error.message);
          errorMessage = 'Server error';
        } else {
          console.error('Upload error:', error);
          errorMessage = 'Upload failed';
        }

        // Update the specific image with error
        setImagesWrappers((prev) => prev.map((item, index) => (index === i ? { ...item, error: errorMessage } : item)));
      }
    });

    // Wait for all uploads to complete
    await Promise.allSettled(uploadPromises);

    setIsImgUploadingProcessing?.(false);
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error during upload process:', error);
    setIsImgUploadingProcessing?.(false);
  }
};
