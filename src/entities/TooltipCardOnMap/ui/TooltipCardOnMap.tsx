import { type Position } from 'geojson';
import { createSearchParams, NavLink } from 'react-router-dom';
import instagramIcon from 'shared/assets/instagram.svg';
import routeToIcon from 'shared/assets/route-to.svg';
import { useToggleFavorite } from 'shared/lib/hooks/interactions/useToggleFavorite';
import { type PlaceProperties } from 'shared/types';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';

import Toast from 'shared/ui/ToastMessage/Toast';
import cls from './TooltipCardOnMap.module.scss';

interface TooltipCardOnMapProps {
  properties: PlaceProperties;
  coordinates: Position;
}

export const TooltipCardOnMap = ({ properties, coordinates }: TooltipCardOnMapProps) => {
  const { id, averageRating, name, address, instagram, image } = properties;

  const { toggleFavorite, toastMessage } = useToggleFavorite(id);

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

  return (
    <div className={cls.TooltipCardOnMap}>
      <NavLink
        to={{
          pathname: '/details',
          search: createSearchParams({ id: properties.id }).toString(),
        }}
      >
        <div className={cls.image}>
          <img src={`./places-images/${image || 'default-place.jpg'}`} alt="Place image" />
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

          <a
            className={cls.iconWrapper}
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={'https://www.instagram.com/' + instagram}
            target="_blank"
            rel="noreferrer"
            title="Open the place's Instagram profile"
          >
            <img className={cls.icon} src={instagramIcon} alt="" />
          </a>
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
      <Toast message={toastMessage} />
    </div>
  );
};
