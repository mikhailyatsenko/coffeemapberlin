import { useEffect } from 'react';
import { UserReviewActivity } from 'features/UserReviewActivity';

export const MyReviews = () => {
  useEffect(() => {
    document.title = 'My reviews | Berlin Coffee Map';
    return () => {
      document.title = 'Berlin Coffee Map';
    };
  }, []);
  return <UserReviewActivity />;
};
