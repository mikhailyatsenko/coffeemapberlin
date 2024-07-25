import cls from './PlaceCard.module.scss';
import instagram from '../../../shared/assets/instagram.svg';
// import { useContext } from 'react';
// import { LocationContext } from 'app/providers/LocationProvider/lib/LocationContext';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import { type PlaceProperties } from 'shared/types';
import { type Position } from 'geojson';

interface PlaceCardProps {
  properties: PlaceProperties;
  coordinates: Position;
  handleCardClick?: (placeId: string) => void;
}

export const PlaceCard = ({ coordinates, properties, handleCardClick }: PlaceCardProps) => {
  const { id, averageRating } = properties;

  // toglle favorite

  // interface FavoriteActionResult {
  //   success: boolean;
  //   message: string | null;
  //   requiresAuth: boolean;
  //   place: PlaceResponse | null;
  // }

  // interface ToggleFavoriteMutationData {
  //   toggleFavorite: FavoriteActionResult;
  // }

  // interface ToggleFavoriteMutationVariables {
  //   placeId: string;
  // }

  // const [toggleFavorite, { loading }] = useMutation<ToggleFavoriteMutationData, ToggleFavoriteMutationVariables>(
  //   TOGGLE_FAVORITE,
  //   {
  //     onCompleted: (data) => {
  //       // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  //       if (data?.toggleFavorite) {
  //         if (data.toggleFavorite.requiresAuth) {
  //           alert(data.toggleFavorite.message ?? 'Authentication required');
  //         } else if (!data.toggleFavorite.success) {
  //           console.error('Failed to toggle favorite:', data.toggleFavorite.message);
  //         }
  //       }
  //     },
  //     onError: (error) => {
  //       console.error('Error toggling favorite:', error);
  //     },
  //   },
  // );

  // const handleToggle = async () => {
  //   await toggleFavorite({
  //     variables: { placeId: id },
  //     update: (cache, { data }) => {
  //       if (data?.toggleFavorite.success && data.toggleFavorite.place) {
  //         cache.modify({
  //           id: cache.identify({ __typename: 'Place', id }),
  //           fields: {
  //             isFavorite: () => data.toggleFavorite.place!.isFavorite,
  //             favoriteCount: () => data.toggleFavorite.place!.favoriteCount,
  //           },
  //         });
  //       }
  //     },
  //   });
  // };

  // toglle favorite

  /// /////test

  return (
    <>
      <div
        {...(handleCardClick && {
          onClick: () => {
            handleCardClick(id);
          },
        })}
        className={`${cls.placeCard} `}
      >
        <div
          className={cls.image}
          style={{
            backgroundImage: `url("${'./places-images/' + properties.image}")`,
          }}
        ></div>
        <div className={cls.content}>
          <a className={cls.header} href={properties.instagram} target="_blank" rel="noreferrer">
            <h4 className={cls.name}>{properties.name}</h4>
            <img className={cls.instagram} src={instagram} alt="" />
          </a>
          <div className={cls.rating}>
            <RatingWidget isClickable={false} rating={averageRating} id={id} /> {averageRating}
          </div>
          <div className={cls.description}>{properties.description}</div>
          <div className={cls.address}>{properties.address}</div>
        </div>
      </div>
    </>
  );
};
