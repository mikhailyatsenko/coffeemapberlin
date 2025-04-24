import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RateNow } from 'features/RateNow';
import { ReviewList } from 'features/ReviewList';
import { HeaderDetailedPlaceCard } from 'entities/HeaderDetailedPlaceCard';
import { useToggleFavorite } from 'shared/api';
import { LocationContext } from 'shared/context/Location/LocationContext';
import { usePlaces } from 'shared/context/PlacesData/usePlaces';
import { type ICharacteristicCounts } from 'shared/types';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { CharacteristicCountsIcon } from 'shared/ui/CharacteristicCountsIcon';
import { InstagramEmbedProfile } from 'shared/ui/InstagramEmbed';
import { Loader } from 'shared/ui/Loader';
import Toast from 'shared/ui/ToastMessage/Toast';
import { usePlaceReviews } from '../api/usePlaceReviews';
import { CoffeeShopSchema } from '../components/CoffeeShopSchema';
import cls from './DetailedPlaceCard.module.scss';

const DetailedPlaceCard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { setLocation } = useContext(LocationContext);
  const [isViewInstProfile, setIsViewInstProfile] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showRateNow, setShowRateNow] = useState(false);

  const detailedCardRef = useRef<HTMLDivElement>(null);
  const placeId = searchParams.get('id');

  const { toggleFavorite, toastMessage } = useToggleFavorite(placeId);

  const { places } = usePlaces();
  const place = places.find((p) => p.properties.id === placeId);

  const { data: placeReviewsData, loading, error } = usePlaceReviews(placeId);

  const reviews = placeReviewsData?.placeReviews.reviews ?? [];

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite();
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const onClose = useCallback(() => {
    navigate({ pathname: '/' });
  }, [navigate]);

  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (place?.geometry.coordinates && setLocation) {
      setLocation(place.geometry.coordinates);
    }
  }, [place?.geometry.coordinates, setLocation]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [handleEscKey]);

  useEffect(() => {
    document.title = place?.properties?.name ? `${place.properties.name} | Berlin Coffee Map` : 'Berlin Coffee Map';
    return () => {
      document.title = 'Berlin Coffee Map';
    };
  }, [place?.properties?.name]);

  if (loading) return <Loader />;

  if (!placeId || !place?.properties) return null;

  const { averageRating, description, name, address, instagram, ratingCount, image, characteristicCounts, isFavorite } =
    place.properties;

  return (
    <div>
      <div className={cls.addressCopmactView}>{address}</div>
      <div onClick={handleClose} className={cls.backDrop}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          ref={detailedCardRef}
          className={cls.detailsContainer}
        >
          <p className={cls.address}>{address}</p>
          <InstagramEmbedProfile normalView={isViewInstProfile} username={instagram} />
          <button className={cls.closeButton} onClick={handleClose}></button>
          <div className={cls.iconsRow}>
            <div
              title={isFavorite ? 'Remove this place from favorites' : 'Add this place to favorites'}
              onClick={handleToggleFavorite}
              className={cls.iconFavWrapper}
            >
              <AddToFavButton isFavorite={Boolean(isFavorite)} />
            </div>
            <button
              className={`${cls.viewInstagramButton} ${isViewInstProfile ? cls.darkColor : ''}`}
              onClick={() => {
                setIsViewInstProfile((prev) => !prev);
              }}
            >
              {isViewInstProfile ? 'Back to place info' : 'View Instagram'}
            </button>
          </div>
          <h2 className={cls.name}>{name}</h2>
          <div className={cls.charCounts}>
            {Object.keys(characteristicCounts)
              .filter((charKey) => charKey !== '__typename')
              .map((charKey) => (
                <CharacteristicCountsIcon
                  characteristic={charKey}
                  characteristicData={characteristicCounts[charKey as keyof ICharacteristicCounts]}
                  key={charKey}
                />
              ))}
          </div>

          {!showRateNow && (
            <HeaderDetailedPlaceCard
              averageRating={averageRating}
              description={description}
              isHeaderVisible={isHeaderVisible}
            />
          )}

          {isHeaderVisible && (
            <RateNow
              setShowRateNow={setShowRateNow}
              showRateNow={showRateNow}
              placeId={placeId}
              reviews={reviews}
              characteristicCounts={characteristicCounts}
            />
          )}

          <ReviewList
            showRateNow={showRateNow}
            setShowRateNow={setShowRateNow}
            reviews={reviews}
            placeId={placeId}
            isCompactView={isHeaderVisible}
            setCompactView={setIsHeaderVisible}
          />

          {/* for Google Rich Results */}
          <CoffeeShopSchema
            address={address}
            averageRating={averageRating}
            reviewCount={ratingCount}
            name={name}
            image={image}
          />
          {/* for Google Rich Results */}
        </div>
      </div>
      <Toast message={toastMessage || error?.message} />
    </div>
  );
};

export default DetailedPlaceCard;
