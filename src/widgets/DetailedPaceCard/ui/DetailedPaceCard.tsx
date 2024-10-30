import { useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RateNow } from 'features/RateNow';
import { ReviewList } from 'features/ReviewList';
import { HeaderDetailedPlacCard } from 'entities/HeaderDetailedPlacCard';
import { useToggleFavorite } from 'shared/lib/hooks/interactions/useToggleFavorite';
import { LocationContext } from 'shared/lib/reactContext/Location/LocationContext';
import { GET_ALL_PLACES, GET_PLACE_DETAILS } from 'shared/query/apolloQueries';
import { type PlaceResponse } from 'shared/types';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { InstagramEmbedProfile } from 'shared/ui/InstagramEmbed';
import { Loader } from 'shared/ui/Loader';
import Toast from 'shared/ui/ToastMessage/Toast';
import { type PlaceDetailsData } from '../../../shared/lib/hooks/interactions/useAddReview';
import CoffeeShopSchema from '../lib/CoffeeShopSchema';
import cls from './DetailedPaceCard.module.scss';

const DetailedPaceCard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { setLocation } = useContext(LocationContext);
  const [isViewInstProfile, setIsViewInstProfile] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const detailedCardRef = useRef<HTMLDivElement>(null);
  const placeId = searchParams.get('id');

  const { toggleFavorite, toastMessage } = useToggleFavorite(placeId);

  const { data: allPlacesData } = useQuery<{ places: PlaceResponse[] }>(GET_ALL_PLACES);
  const { data: placeDetailsData, loading } = useQuery<PlaceDetailsData>(GET_PLACE_DETAILS, {
    variables: { placeId, skip: !placeId },
  });

  const place = allPlacesData?.places.find((p) => p.properties.id === placeId);
  const reviews = placeDetailsData?.placeDetails.reviews ?? [];

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

  const { averageRating, description, name, address, instagram, ratingCount, image } = place.properties;

  return (
    <>
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
              <AddToFavButton isFavorite={Boolean(place.properties.isFavorite)} />
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
          <HeaderDetailedPlacCard
            averageRating={averageRating}
            description={description}
            isHeaderVisible={isHeaderVisible}
          />
          <RateNow placeId={placeId} reviews={reviews} />
          <ReviewList
            reviews={reviews}
            placeId={placeId}
            isCompactView={isHeaderVisible}
            setCompactView={setIsHeaderVisible}
          />
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
    </>
  );
};

export default DetailedPaceCard;
