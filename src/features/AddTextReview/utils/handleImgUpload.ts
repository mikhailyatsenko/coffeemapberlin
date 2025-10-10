import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/react';
import { type ImageUploadProgress } from '../types';

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
  fileInput: File[],
  placeId: string,
  reviewId: string,
  setFilesProgress: React.Dispatch<React.SetStateAction<ImageUploadProgress[]>>,
) => {
  // Access the file input element using the ref
  const abortController = new AbortController();
  if (!fileInput || fileInput.length === 0) {
    console.error('No files to upload');
    alert('Please select a file to upload');
    return;
  }
  for (let i = 0; i < fileInput.length; i++) {
    const file = fileInput[i];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error('Failed to authenticate for upload:', authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

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
          setFilesProgress((prev) =>
            prev.map((item, index) => (index === i ? { ...item, progress: (event.loaded / event.total) * 100 } : item)),
          );
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error('Upload aborted:', error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error('Invalid request:', error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error('Network error:', error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error('Server error:', error.message);
      } else {
        // Handle any other errors that may occur.
        console.error('Upload error:', error);
      }
    }
  }
};
