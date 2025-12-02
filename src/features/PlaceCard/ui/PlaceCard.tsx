import clsx from 'clsx';
import { type Position } from 'geojson';
import { memo, useEffect, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
// import { useToggleFavorite } from 'shared/api';
import instagram from 'shared/assets/instagram.svg';
// import roteToImage from 'shared/assets/route-to.svg';
import showPlacePointOnMap from 'shared/assets/show-on-map.svg';
import { IMAGEKIT_CDN_URL, RoutePaths } from 'shared/constants';
import { type GetPlacesQuery } from 'shared/generated/graphql';
import { useWidth } from 'shared/hooks';
import { setCurrentPlacePosition, setShowFavorites, usePlacesStore } from 'shared/stores/places';
import { AddToFavButton } from 'shared/ui/AddToFavButton';

import { BadgePill } from 'shared/ui/BadgePill';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import cls from './PlaceCard.module.scss';

interface PlaceCardProps {
  properties: GetPlacesQuery['places']['places'][number]['properties'];
  coordinates: Position;
  index: number;
}

const PlaceCardComponent = ({ properties, coordinates, index }: PlaceCardProps) => {
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const nameRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [nameScrollWidth, setNameScrollWidth] = useState<number>();
  const [shouldNameScroll, setShouldNameScroll] = useState(false);

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (properties.instagram) {
      window.open(properties.instagram, '_blank', 'noopener,noreferrer');
    }
  };

  // const handleDirectionsClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   const url = `https://www.google.com/maps/place/?q=place_id:${properties.googleId}`;
  //   window.open(url, '_blank', 'noopener,noreferrer');
  // };

  const handleShowOnMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (coordinates) {
      setCurrentPlacePosition(coordinates);
      if (showFavorites) setShowFavorites(false);
    }
  };

  const placePath = generatePath(`/${RoutePaths.placePage}`, { id: properties.id });

  const width = useWidth();
  const isMobile = width <= 767;
  useEffect(() => {
    if (nameRef?.current?.clientWidth) {
      setNameScrollWidth(nameRef?.current?.scrollWidth);
    }
  }, []);

  useEffect(() => {
    if (nameScrollWidth) {
      if (isMobile) {
        // TODO constants
        setShouldNameScroll(nameScrollWidth > 198);
      } else {
        setShouldNameScroll(nameScrollWidth > 258);
      }
    }
  }, [nameScrollWidth, isMobile]);
  return (
    <div
      onClick={() => {
        navigate({ pathname: placePath });
      }}
      className={`${cls.placeCard} `}
    >
      <div className={cls.image}>
        <ImgWithLoader
          fetchPriority={index < 1 ? 'high' : 'auto'}
          src={`${IMAGEKIT_CDN_URL}/places-main-img/${properties.id}/main.jpg?tr=if-ar_gt_1,w-320,if-else,h-320,if-end`}
          alt=""
          errorFallbackUrl="/places-images/default-place-img.jpg"
        />
      </div>
      <div className={cls.content}>
        <div className={cls.cardHeader}>
          <div className={cls.name}>
            <h4
              ref={nameRef}
              style={
                nameScrollWidth && shouldNameScroll
                  ? { ['--scroll-distance' as unknown as string]: `${(isMobile ? 198 : 258) - nameScrollWidth}px` }
                  : undefined
              }
              className={clsx({ [cls.marquee]: shouldNameScroll })}
            >
              {properties.name}
            </h4>
          </div>

          <div className={cls.iconsGroup}>
            <AddToFavButton
              theme="circle"
              placeName={properties.name}
              placeId={properties.id}
              isFavorite={properties.isFavorite}
            />
          </div>
        </div>
        <div className={cls.rating}>
          <RatingWidget isClickable={false} rating={properties.averageRating} />{' '}
          {Boolean(properties.averageRating) && properties.averageRating}
        </div>
        {properties.description && <div className={cls.description}>{properties.description}</div>}
        {properties.neighborhood && (
          <BadgePill text={properties.neighborhood} color="green" size="small" className={cls.badgePill} />
        )}
        <div className={cls.cardFooter}>
          <div className={cls.address}>
            <p>{properties.address}</p>
          </div>
          <div className={cls.iconsGroup}>
            {properties.instagram && (
              <button
                className={cls.iconWrapper}
                onClick={handleInstagramClick}
                title="Open the place's Instagram profile"
              >
                <img className={cls.icon} src={instagram} alt="" />
              </button>
            )}

            {/* <button onClick={handleDirectionsClick} title="Get directions on Google Maps" className={cls.iconWrapper}>
            <img className={cls.icon} src={roteToImage} alt="" />
          </button> */}

            <button onClick={handleShowOnMapClick} title="Show location on the map" className={cls.iconWrapper}>
              <img className={cls.icon} src={showPlacePointOnMap} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PlaceCard = memo(PlaceCardComponent, (prev, next) => prev.properties === next.properties);
