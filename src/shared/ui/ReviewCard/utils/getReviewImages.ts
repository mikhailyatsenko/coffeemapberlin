import { IMAGEKIT_CDN_URL } from 'shared/constants';

export const getReviewImages = (placeId: string, reviewId: string, count: number) => {
  const images = [];
  for (let i = 1; i <= count; i++) {
    const url = `${IMAGEKIT_CDN_URL}/3welle/review-images/${placeId}/${reviewId}/image_${i}.jpg`;
    images.push(url);
  }
  return images;
};
