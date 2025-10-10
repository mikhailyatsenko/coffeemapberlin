/**
 * Resize to max 1440 on the longer side, convert to JPEG, and compress.
 */
export async function resizeAndConvertToJpeg(file: File, maxLongSide = 1440, quality = 0.82): Promise<Blob> {
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

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        b ? resolve(b) : reject(new Error('Failed to generate JPEG blob'));
      },
      'image/jpeg',
      quality,
    );
  });

  return blob;
}
