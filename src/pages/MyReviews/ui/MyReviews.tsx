import { Helmet } from 'react-helmet';
import { UserReviewActivity } from 'features/UserReviewActivity';

export const MyReviews = () => {
  return (
    <>
      <Helmet>
        <title>My reviews | Berlin Coffee Map</title>
      </Helmet>
      <UserReviewActivity />
    </>
  );
};
