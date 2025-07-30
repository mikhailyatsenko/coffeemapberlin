import { IMAGEKIT_CDN_URL } from 'shared/constants';

export const getReviewImages = (id: string, count: number) => {
  const images = [];
  for (let i = 1; i <= count; i++) {
    const url = `${IMAGEKIT_CDN_URL}/google-reviews/${id}/review_${i}.jpg`;
    images.push(url);
  }
  return images;
};
