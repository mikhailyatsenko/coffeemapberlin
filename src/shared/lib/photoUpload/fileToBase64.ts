const CHUNK_SIZE = 0x8000;

/** The file's bytes as base64, the form `uploadReviewImage` takes them in. */
export const fileToBase64 = async (file: File): Promise<string> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';

  // Chunked so a large photo does not blow the argument limit of String.apply.
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }

  return btoa(binary);
};
