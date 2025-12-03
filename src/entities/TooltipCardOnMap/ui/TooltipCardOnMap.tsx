import { type Position } from 'geojson';
import { NavLink, generatePath } from 'react-router-dom';
import instagramIcon from 'shared/assets/instagram.svg';
import routeToIcon from 'shared/assets/route-to.svg';
import { IMAGEKIT_CDN_URL, RoutePaths } from 'shared/constants';
import { type GetPlacesQuery } from 'shared/generated/graphql';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { BadgePill } from 'shared/ui/BadgePill';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';

import cls from './TooltipCardOnMap.module.scss';

interface TooltipCardOnMapProps {
  properties: GetPlacesQuery['places']['places'][number]['properties'];
  coordinates: Position;
}

export const TooltipCardOnMap = ({ properties, coordinates }: TooltipCardOnMapProps) => {
  const { averageRating, name, address, instagram } = properties;

  const placePath = generatePath(`/${RoutePaths.placePage}`, { id: properties.id });

  return (
    <div className={cls.TooltipCardOnMap}>
      <NavLink
        to={{
          pathname: placePath,
        }}
      >
        <div className={cls.image}>
          <ImgWithLoader
            errorFallbackUrl="/places-images/default-tooltip-img.jpg"
            src={`${IMAGEKIT_CDN_URL}/places-main-img/${properties.id}/main.jpg?tr=if-ar_gt_1,w-320,if-else,h-320,if-end`}
            alt=""
            className={cls.imageContent}
          />
        </div>
      </NavLink>

      <div className={cls.content}>
        <div className={cls.header}>
          <NavLink
            to={{
              pathname: placePath,
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
              pathname: placePath,
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
            href={`https://www.google.com/maps/search/${properties.name}/@${coordinates[1]},${coordinates[0]},18z`}
            target="_blank"
            rel="noreferrer"
            title="Get directions on Google Maps"
          >
            <img className={cls.icon} src={routeToIcon} alt="" />
          </a>

          <AddToFavButton
            theme="circle"
            placeName={properties.name}
            placeId={properties.id}
            isFavorite={properties.isFavorite}
          />
        </div>
      </div>
    </div>
  );
};
