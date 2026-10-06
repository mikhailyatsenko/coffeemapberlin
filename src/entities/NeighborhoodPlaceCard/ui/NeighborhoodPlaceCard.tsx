import { generatePath, Link } from 'react-router-dom';
import { IMAGEKIT_CDN_URL, RoutePaths } from 'shared/constants';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import { RatingSummary } from 'shared/ui/RatingSummary';
import { shortAddress } from '../lib/shortAddress';
import { type NeighborhoodPlaceCardProps } from '../types';
import cls from './NeighborhoodPlaceCard.module.scss';

/** A compact Place card for a Neighborhood shelf: photo, name, Average rating, Favorite and street. */
export const NeighborhoodPlaceCard = ({ place, onOpen }: NeighborhoodPlaceCardProps) => {
  const { properties } = place;
  const placePath = generatePath(`/${RoutePaths.placePage}`, { id: properties.id });
  const imageSrc = properties.image
    ? `${IMAGEKIT_CDN_URL}/places-main-img/${properties.id}/main.jpg?tr=if-ar_gt_1,w-600,if-else,h-400,if-end`
    : 'places-images/default-place.jpg';

  return (
    // Only the title and the photo open the Place page, so Favorite stays on the card.
    <article className={cls.card} aria-labelledby={`place-card-${properties.id}`}>
      <Link to={placePath} onClick={onOpen} className={cls.imageContainer} tabIndex={-1} aria-hidden="true">
        <ImgWithLoader
          loading="lazy"
          src={imageSrc}
          alt={properties.name}
          className={cls.image}
          errorFallbackUrl="/places-images/default-place.jpg"
        />
      </Link>
      <div className={cls.content}>
        <div className={cls.header}>
          <h3 id={`place-card-${properties.id}`} className={cls.title}>
            <Link to={placePath} onClick={onOpen} className={cls.titleLink}>
              {properties.name}
            </Link>
          </h3>
          <div className={cls.favorite}>
            <AddToFavButton
              theme="circle"
              placeName={properties.name}
              placeId={properties.id}
              isFavorite={properties.isFavorite}
            />
          </div>
        </div>
        <RatingSummary averageRating={properties.averageRating} ratingCount={properties.ratingCount} size="small" />
        {properties.address && <p className={cls.address}>{shortAddress(properties.address)}</p>}
      </div>
    </article>
  );
};
