import { useNavigate } from 'react-router-dom';
import { IMAGEKIT_CDN_URL } from 'shared/constants';
import { type GetFavoritePlacesQuery } from 'shared/generated/graphql';
import { AddToFavButton } from 'shared/ui/AddToFavButton/ui/AddToFavButton';
import { BadgePill } from 'shared/ui/BadgePill';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';

import cls from './FavoritesModal.module.scss';

interface FavoritesModalProps {
  favoritePlaces: GetFavoritePlacesQuery['favoritePlaces'];
  onClose: () => void;
}

export const FavoritesModal = ({ favoritePlaces, onClose }: FavoritesModalProps) => {
  const navigate = useNavigate();

  const onOpenPlaceClick = (placeId: string) => {
    onClose();
    navigate(`place/${placeId}`);
  };

  return (
    <PortalToBody>
      <Modal onClose={onClose} closeOnEsc={true} widthOnDesktop={400}>
        {favoritePlaces.length > 0 ? (
          <>
            <h3 className={cls.title}>Your Favorites ❤️</h3>
            <div className={cls.listContainer}>
              {favoritePlaces?.map((place, index) => (
                <div
                  role="button"
                  onClick={() => {
                    onOpenPlaceClick(place.id);
                  }}
                  key={place.id}
                  className={cls.placeCard}
                >
                  <ImgWithLoader
                    className={cls.image}
                    loading={index < 1 ? 'eager' : 'lazy'}
                    fetchPriority={index < 1 ? 'high' : 'auto'}
                    errorFallbackUrl="/places-images/default-tooltip-img.jpg"
                    src={`${IMAGEKIT_CDN_URL}/places-main-img/${place.id}/main.jpg?tr=if-ar_gt_1,w-320,if-else,h-320,if-end`}
                    alt=""
                  />
                  <div className={cls.favBtn}>
                    <AddToFavButton
                      theme="circle"
                      placeName={place.name}
                      placeId={place.id}
                      isFavorite={place.isFavorite}
                    />
                  </div>

                  <div className={cls.placeCardDetails}>
                    <h4 className={cls.placeName}>{place.name}</h4>
                    <RatingWidget isClickable={false} rating={place.averageRating} />{' '}
                    {place.neighborhood && (
                      <BadgePill text={place.neighborhood} color="green" size="small" className={cls.badgePill} />
                    )}
                    <p className={cls.placeAddress}>{place.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={cls.emptyState}>
            <p>You don&apos;t have any favorites yet. Add some places to your favorites to see them here.</p>
          </div>
        )}
      </Modal>
    </PortalToBody>
  );
};
