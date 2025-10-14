/**
 * Resize to max 1440 on the longer side, convert to WebP, and compress.
 * Falls back to JPEG if WebP is not supported.
 */
export async function resizeAndConvert(file: File, maxLongSide = 1440, quality = 0.82): Promise<Blob> {
  const imageBitmap = await createImageBitmap(file);
  const { width, height } = imageBitmap;
  const longSide = Math.max(width, height);
  const scale = longSide > maxLongSide ? maxLongSide / longSide : 1;
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');
  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

  // Check WebP support
  const webpSupported = await checkWebPSupport();

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        b ? resolve(b) : reject(new Error('Failed to generate image blob'));
      },
      webpSupported ? 'image/webp' : 'image/jpeg',
      quality,
    );
  });

  return blob;
}

/**
 * Check if browser supports WebP format
 */
async function checkWebPSupport(): Promise<boolean> {
  return await new Promise((resolve) => {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      resolve(webp.height === 2);
    };
    webp.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}
