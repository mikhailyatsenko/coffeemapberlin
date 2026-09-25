export interface AddPhotosProps {
  placeId: string;
  /** The Review the Photos go to; missing while the first Rating is still saving. */
  reviewId?: string;
  /** How many Photos the Review has, as the caller last fetched it. */
  reviewPhotoCount: number;
  /** Whether the Review has Review text, as sent with `photos_uploaded`. */
  hasReviewText: boolean;
}
