import { useQuery } from '@apollo/client';
import { ReviewActivityCard } from 'entities/ReviewActivityCard';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { GET_USER_REVIEW_ACTIVITY } from 'shared/query/apolloQueries';
import cls from './UserReviewActivity.module.scss';

interface UserReviewActivityData {
  rating: number | null;
  review: string | null;
  placeName: string;
  placeId: string;
  averageRating: number | null;
  createdAt: string;
}

export const UserReviewActivity = () => {
  const { loading, error, data } = useQuery<{ getUserReviewActivity: UserReviewActivityData[] }>(
    GET_USER_REVIEW_ACTIVITY,
  );

  const { user } = useAuth();

  if (!user) return <p>You need to be logged in to perform this action.</p>;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No yet reviews</p>;

  return (
    <div className={cls.UserReviewActivity}>
      <h2 className={cls.header}>My reviews and ratings:</h2>

      {data.getUserReviewActivity.length === 0 ? (
        <p className={cls.infoNoActivity}>
          All your reviews and ratings will be displayed here. You haven&apos;t submitted any reviews or ratings yet.
        </p>
      ) : (
        <ul>
          {data.getUserReviewActivity.map((activityData) => (
            <ReviewActivityCard
              key={activityData.placeId}
              userRating={activityData.rating}
              review={activityData.review}
              placeName={activityData.placeName}
              averageRating={activityData.averageRating}
              createdAt={activityData.createdAt}
              placeId={activityData.placeId}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
