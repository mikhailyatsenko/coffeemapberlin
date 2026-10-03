import { generatePath, Link } from 'react-router-dom';
import instagram from 'shared/assets/instagram.svg';
import { IMAGEKIT_CDN_URL, RoutePaths } from 'shared/constants';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { BadgePill } from 'shared/ui/BadgePill';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import { type NeighborhoodPlaceCardProps } from '../types';
import cls from './NeighborhoodPlaceCard.module.scss';

export const NeighborhoodPlaceCard = ({ place, onOpen, contribution }: NeighborhoodPlaceCardProps) => {
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
    // Only the title and the photo open the Place page, so taps elsewhere (the contribution) stay on the card.
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
          <div className={cls.titleSection}>
            <h3 id={`place-card-${properties.id}`} className={cls.title}>
              <Link to={placePath} onClick={onOpen} className={cls.titleLink}>
                {properties.name}
              </Link>
            </h3>
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
          {properties.ratingCount > 0 ? (
            <>
              <RatingWidget isClickable={false} rating={properties.averageRating} />
              {Boolean(properties.averageRating) && (
                <span className={cls.ratingValue}>{properties.averageRating?.toFixed(1)}</span>
              )}
              <span className={cls.ratingCount}>
                ({properties.ratingCount} review{properties.ratingCount !== 1 ? 's' : ''})
              </span>
            </>
          ) : (
            <span className={cls.noRatings}>No ratings yet — be the first</span>
          )}
        </div>

        {contribution}

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
    </article>
  );
};
