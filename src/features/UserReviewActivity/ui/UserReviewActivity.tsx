import { ReviewActivityCard } from 'entities/ReviewActivityCard';
import { useGetUserReviewActivityQuery } from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import cls from './UserReviewActivity.module.scss';

export const UserReviewActivity = () => {
  const { data, loading, error } = useGetUserReviewActivityQuery();
  const { user } = useAuthStore();

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
              userRating={activityData.rating ?? undefined}
              reviewText={activityData.reviewText ?? undefined}
              placeName={activityData.placeName}
              averageRating={activityData.averageRating ?? undefined}
              createdAt={activityData.createdAt}
              placeId={activityData.placeId}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
