import { type Position } from 'geojson';
import { useContext } from 'react';
import { createSearchParams, NavLink, useNavigate } from 'react-router-dom';
import { LocationContext } from 'app/providers/LocationProvider/lib/LocationContext';
import { usePlaces } from 'app/providers/PlacesDataProvider/ui/PlacesDataProvider';
import { useToggleFavorite } from 'shared/lib/hooks/interactions/useToggleFavorite';
import LazyImage from 'shared/lib/LazyImage/LazyImage';
import { type PlaceProperties } from 'shared/types';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import Toast from 'shared/ui/ToastMessage/Toast';
import instagram from '../../../shared/assets/instagram.svg';
import roteToImage from '../../../shared/assets/route-to.svg';
import showPlacePointOnMap from '../../../shared/assets/show-on-map.svg';
import cls from './PlaceCard.module.scss';

interface PlaceCardProps {
  properties: PlaceProperties;
  coordinates: Position;
}

export const PlaceCard = ({ properties, coordinates }: PlaceCardProps) => {
  const { setLocation } = useContext(LocationContext);
  const { toggleFavorite, toastMessage } = useToggleFavorite(properties.id);
  const { setShowFavorite, showFavorites } = usePlaces();
  const navigate = useNavigate();

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

  const handleClickDetails = () => {
    navigate({
      pathname: '/details',
      search: createSearchParams({ id: properties.id }).toString(),
    });
  };

  return (
    <>
      <div onClick={handleClickDetails} className={`${cls.placeCard} `}>
        <div className={cls.image}>
          <LazyImage src={`./places-images/${properties.image || 'default-place.jpg'}`} alt="Place image" />
        </div>
        <div className={cls.content}>
          <div className={cls.cardHeader}>
            <NavLink
              to={{
                pathname: '/details',
                search: createSearchParams({ id: properties.id }).toString(),
              }}
            >
              <h4 className={cls.name}>{properties.name}</h4>
            </NavLink>
            <div className={cls.iconsGroup}>
              <div
                title={properties.isFavorite ? 'Remove this place from favorites' : 'Add this place to favorites'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite();
                }}
                className={cls.iconWrapper}
              >
                <AddToFavButton isFavorite={properties.isFavorite} />
              </div>
            </div>
          </div>
          <div className={cls.rating}>
            <RatingWidget isClickable={false} rating={properties.averageRating} id={properties.id} />{' '}
            {Boolean(properties.averageRating) && properties.averageRating}
          </div>
          <div className={cls.description}>{properties.description}</div>
          <div className={cls.address}>
            <p>{properties.address}</p>
            <div className={cls.iconsGroup}>
              <a
                className={cls.iconWrapper}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                href={'https://www.instagram.com/' + properties.instagram}
                target="_blank"
                rel="noreferrer"
                title="Open the place's Instagram profile"
              >
                <img className={cls.icon} src={instagram} alt="" />
              </a>

              <a
                onClick={(e) => {
                  e.stopPropagation();
                }}
                href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}&travelmode=walking`}
                target="_blank"
                rel="noreferrer"
                title="Get directions on Google Maps"
                className={cls.iconWrapper}
              >
                <img className={cls.icon} src={roteToImage} alt="" />
              </a>

              <a
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (coordinates && setLocation) {
                    setLocation(coordinates);
                    if (showFavorites) setShowFavorite(false);
                  }
                }}
                rel="noreferrer"
                title="Show location on the map"
                className={cls.iconWrapper}
              >
                <img className={cls.icon} src={showPlacePointOnMap} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};
