import { generatePath, Link } from 'react-router-dom';
import { IMAGEKIT_CDN_URL, RoutePaths } from 'shared/constants';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import { RatingSummary } from 'shared/ui/RatingSummary';
import { AmenityIcons } from '../components/AmenityIcons';
import { shortAddress } from '../lib/shortAddress';
import { type NeighborhoodPlaceRowProps } from '../types';
import cls from './NeighborhoodPlaceRow.module.scss';

/** A dense Place row for a Neighborhood's full list: small photo, name, Average rating, Amenity icons, street, Favorite and a contribution slot. */
export const NeighborhoodPlaceRow = ({ place, onOpen, contribution }: NeighborhoodPlaceRowProps) => {
  const { properties } = place;
  const placePath = generatePath(`/${RoutePaths.placePage}`, { id: properties.id });
  const imageSrc = properties.image
    ? `${IMAGEKIT_CDN_URL}/places-main-img/${properties.id}/main.jpg?tr=w-160,h-160`
    : 'places-images/default-place.jpg';

  return (
    // Only the name and the photo open the Place page, so taps on the beans and Favorite stay on the row.
    <article className={cls.row} aria-labelledby={`place-row-${properties.id}`}>
      <Link to={placePath} onClick={onOpen} className={cls.imageContainer} tabIndex={-1} aria-hidden="true">
        <ImgWithLoader
          loading="lazy"
          src={imageSrc}
          alt={properties.name}
          className={cls.image}
          errorFallbackUrl="/places-images/default-place.jpg"
        />
      </Link>
      <div className={cls.info}>
        <h3 id={`place-row-${properties.id}`} className={cls.title}>
          <Link to={placePath} onClick={onOpen} className={cls.titleLink}>
            {properties.name}
          </Link>
        </h3>
        <RatingSummary averageRating={properties.averageRating} ratingCount={properties.ratingCount} size="small" />
        <AmenityIcons shortlistIds={properties.shortlistIds} />
        {properties.address && <p className={cls.address}>{shortAddress(properties.address)}</p>}
      </div>
      {contribution && <div className={cls.contribution}>{contribution}</div>}
      <div className={cls.favorite}>
        <AddToFavButton
          theme="circle"
          placeName={properties.name}
          placeId={properties.id}
          isFavorite={properties.isFavorite}
        />
      </div>
    </article>
  );
};
