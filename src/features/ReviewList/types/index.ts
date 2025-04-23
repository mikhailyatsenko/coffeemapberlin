export interface Review {
  id: string;
  text?: string;
  userId: string;
  userRating?: number;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  isOwnReview: boolean;
}

export interface ReviewListProps {
  showRateNow: boolean;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
  placeId: string;
  isCompactView: boolean;
  setCompactView: (isCompact: boolean) => void;
}
