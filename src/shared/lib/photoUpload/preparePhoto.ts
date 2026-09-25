import { resizeAndConvert } from 'shared/lib/image';
import { type Photo } from './types';

let nextId = 0;

/** Downscales a picked file; a file the browser can't decode becomes an `unreadable` Photo. */
export const preparePhoto = async (file: File): Promise<Photo> => {
  nextId += 1;
  const id = `photo-${nextId}`;

  try {
    const resized = await resizeAndConvert(file);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const downscaled = new File([resized], `${baseName}.jpg`, { type: resized.type || 'image/webp' });

    return { id, name: file.name, file: downscaled, localUrl: URL.createObjectURL(downscaled), status: 'pending' };
  } catch {
    return { id, name: file.name, localUrl: URL.createObjectURL(file), status: 'failed', reason: 'unreadable' };
  }
};
