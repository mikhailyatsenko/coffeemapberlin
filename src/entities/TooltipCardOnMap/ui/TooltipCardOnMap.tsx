import { type Position } from 'geojson';
import { NavLink, createSearchParams } from 'react-router-dom';
import { useToggleFavorite } from 'shared/api';
import instagramIcon from 'shared/assets/instagram.svg';
import routeToIcon from 'shared/assets/route-to.svg';
import { IMAGEKIT_CDN_URL } from 'shared/constants';
import { type GetAllPlacesQuery } from 'shared/generated/graphql';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { BadgePill } from 'shared/ui/BadgePill';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';

import cls from './TooltipCardOnMap.module.scss';

interface TooltipCardOnMapProps {
  properties: GetAllPlacesQuery['places'][number]['properties'];
  coordinates: Position;
}

export const TooltipCardOnMap = ({ properties, coordinates }: TooltipCardOnMapProps) => {
  const { id, averageRating, name, address, instagram, image } = properties;

  const { toggleFavorite } = useToggleFavorite(id);

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite();
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const imageSrc = image
    ? `${IMAGEKIT_CDN_URL}/places-main-img/${properties.id}/main.jpg?tr=if-ar_gt_1,w-320,if-else,h-320,if-end`
    : '/places-images/default-place.jpg';

  return (
    <div className={cls.TooltipCardOnMap}>
      <NavLink
        to={{
          pathname: '/details',
          search: createSearchParams({ id: properties.id }).toString(),
        }}
      >
        <div className={cls.image}>
          <ImgWithLoader src={imageSrc} alt="" className={cls.imageContent} />
        </div>
      </NavLink>

      <div className={cls.content}>
        <div className={cls.header}>
          <NavLink
            to={{
              pathname: '/details',
              search: createSearchParams({ id: properties.id }).toString(),
            }}
          >
            <h4 className={cls.name}>{name}</h4>
          </NavLink>
          <div className={cls.iconsGroup}></div>
        </div>

        <div className={cls.rating}>
          <RatingWidget isClickable={false} rating={averageRating} /> {Boolean(averageRating) && averageRating}
        </div>
        {properties.neighborhood && (
          <BadgePill text={properties.neighborhood} color="green" size="small" className={cls.badgePill} />
        )}
        <div className={cls.address}>{address}</div>
        <div className={cls.iconsGroup}>
          <NavLink
            to={{
              pathname: '/details',
              search: createSearchParams({ id: properties.id }).toString(),
            }}
          >
            <button className={cls.moreButton}>More details</button>
          </NavLink>

          {instagram && (
            <a
              className={cls.iconWrapper}
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={instagram}
              target="_blank"
              rel="noreferrer"
              title="Open the place's Instagram profile"
            >
              <img className={cls.icon} src={instagramIcon} alt="" />
            </a>
          )}
          <a
            className={cls.iconWrapper}
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}&travelmode=walking`}
            target="_blank"
            rel="noreferrer"
            title="Get directions on Google Maps"
          >
            <img className={cls.icon} src={routeToIcon} alt="" />
          </a>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
            className={cls.iconWrapper}
            title={properties.isFavorite ? 'Remove this place from favorites' : 'Add this place to favorites'}
          >
            <AddToFavButton isFavorite={properties.isFavorite} />
          </div>
        </div>
      </div>
    </div>
  );
};
