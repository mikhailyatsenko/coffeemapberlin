import { memo } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import instagram from 'shared/assets/instagram.svg';
import { IMAGEKIT_CDN_URL, RoutePaths } from 'shared/constants';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { BadgePill } from 'shared/ui/BadgePill';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import { type NeighborhoodPlaceCardProps } from '../types';
import cls from './NeighborhoodPlaceCard.module.scss';

const NeighborhoodPlaceCardComponent = ({ place }: NeighborhoodPlaceCardProps) => {
  const navigate = useNavigate();
  const { properties } = place;

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (properties.instagram) {
      window.open(properties.instagram, '_blank', 'noopener,noreferrer');
    }
  };

  const placePath = generatePath(`/${RoutePaths.placePage}`, { id: properties.id });

  const imageSrc = properties.image
    ? `${IMAGEKIT_CDN_URL}/places-main-img/${properties.id}/main.jpg?tr=if-ar_gt_1,w-600,if-else,h-400,if-end`
    : 'places-images/default-place.jpg';

  return (
    <div
      onClick={() => {
        navigate({ pathname: placePath });
      }}
      className={cls.card}
    >
      <div className={cls.imageContainer}>
        <ImgWithLoader
          loading="lazy"
          src={imageSrc}
          alt={properties.name}
          className={cls.image}
          errorFallbackUrl="/places-images/default-place.jpg"
        />
      </div>
      <div className={cls.content}>
        <div className={cls.header}>
          <div className={cls.titleSection}>
            <h2 className={cls.title}>{properties.name}</h2>
            {properties.neighborhood && (
              <BadgePill text={properties.neighborhood} color="green" size="small" className={cls.badge} />
            )}
          </div>
          <AddToFavButton
            theme="circle"
            placeName={properties.name}
            placeId={properties.id}
            isFavorite={properties.isFavorite}
          />
        </div>

        <div className={cls.ratingSection}>
          <RatingWidget isClickable={false} rating={properties.averageRating} />
          {Boolean(properties.averageRating) && (
            <span className={cls.ratingValue}>{properties.averageRating?.toFixed(1)}</span>
          )}
          {properties.ratingCount > 0 && <span className={cls.ratingCount}>({properties.ratingCount} reviews)</span>}
        </div>

        {properties.description && <p className={cls.description}>{properties.description}</p>}

        <div className={cls.footer}>
          <div className={cls.address}>
            <span className={cls.addressIcon}>📍</span>
            <span>{properties.address}</span>
          </div>
          {properties.instagram && (
            <button
              className={cls.instagramButton}
              onClick={handleInstagramClick}
              title="Open the place's Instagram profile"
              type="button"
            >
              <img className={cls.instagramIcon} src={instagram} alt="Instagram" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const NeighborhoodPlaceCard = memo(
  NeighborhoodPlaceCardComponent,
  (prev, next) =>
    prev.place.id === next.place.id && prev.place.properties.isFavorite === next.place.properties.isFavorite,
);
