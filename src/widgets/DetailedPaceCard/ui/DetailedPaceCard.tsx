import { useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RateNow } from 'features/RateNow';
import { ReviewList } from 'features/ReviewList';
import { HeaderDetailedPlaceCard } from 'entities/HeaderDetailedPlaceCard';
import { type PlaceReviewsData } from 'shared/lib/hooks/interactions/useAddTextReview';
import { useToggleFavorite } from 'shared/lib/hooks/interactions/useToggleFavorite';
import { LocationContext } from 'shared/lib/reactContext/Location/LocationContext';
import { GET_ALL_PLACES, GET_PLACE_REVIEWS } from 'shared/query/apolloQueries';
import { type ICharacteristicCounts, type PlaceResponse } from 'shared/types';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { CharacteristicCountsIcon } from 'shared/ui/CharacteristicCountsIcon';
import { InstagramEmbedProfile } from 'shared/ui/InstagramEmbed';
import { Loader } from 'shared/ui/Loader';
import Toast from 'shared/ui/ToastMessage/Toast';
import CoffeeShopSchema from '../lib/CoffeeShopSchema';
import cls from './DetailedPaceCard.module.scss';

const DetailedPaceCard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { setLocation } = useContext(LocationContext);
  const [isViewInstProfile, setIsViewInstProfile] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showRateNow, setShowRateNow] = useState(false);

  const detailedCardRef = useRef<HTMLDivElement>(null);
  const placeId = searchParams.get('id');

  const { toggleFavorite, toastMessage } = useToggleFavorite(placeId);

  const { data: allPlacesData } = useQuery<{ places: PlaceResponse[] }>(GET_ALL_PLACES);
  const { data: placeReviewsData, loading } = useQuery<PlaceReviewsData>(GET_PLACE_REVIEWS, {
    variables: { placeId, skip: !placeId },
  });

  const place = allPlacesData?.places.find((p) => p.properties.id === placeId);
  const reviews = placeReviewsData?.placeReviews.reviews ?? [];

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

  useEffect(() => {
    if (place?.geometry.coordinates && setLocation) {
      setLocation(place.geometry.coordinates);
    }
  }, [place?.geometry.coordinates, setLocation]);

  const onClose = useCallback(() => {
    navigate({ pathname: '/' });
  }, [navigate]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  useEffect(() => {
    document.title = place?.properties?.name ? `${place.properties.name} | Berlin Coffee Map` : 'Berlin Coffee Map';

    return () => {
      document.title = 'Berlin Coffee Map';
    };
  }, [place?.properties?.name]);

  if (!placeId) return null;
  if (!place?.properties || loading) return <Loader />;

  const { averageRating, description, name, address, instagram, ratingCount, image, characteristicCounts, isFavorite } =
    place.properties;

  return (
    <div>
      <div className={cls.addressCopmactView}>{address}</div>
      <div
        onClick={() => {
          onClose();
        }}
        className={cls.backDrop}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          ref={detailedCardRef}
          className={cls.detailsContainer}
        >
          <p className={cls.address}>{address}</p>
          <InstagramEmbedProfile normalView={isViewInstProfile} username={instagram} />
          <button
            className={cls.closeButton}
            onClick={() => {
              onClose();
            }}
          ></button>
          <div className={cls.iconsRow}>
            <div
              title={place.properties.isFavorite ? 'Remove this place from favorites' : 'Add this place to favorites'}
              onClick={async (e) => {
                e.stopPropagation();
                await handleToggleFavorite();
              }}
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
      <Toast message={toastMessage} />
    </div>
  );
};

export default DetailedPaceCard;
