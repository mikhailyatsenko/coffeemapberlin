import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RateNow } from 'features/RateNow';
import { ReviewList } from 'features/ReviewList';
import { HeaderDetailedPlaceCard } from 'entities/HeaderDetailedPlaceCard';
import { OpeningHours } from 'entities/OpeningHours';
import { useToggleFavorite } from 'shared/api';
import { IMAGEKIT_CDN_URL } from 'shared/constants';
import { useGetAllPlacesQuery, usePlaceQuery, type Characteristic } from 'shared/generated/graphql';
import { setCurrentPlacePosition } from 'shared/stores/places';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { CharacteristicCountsIcon, characteristicsMap } from 'shared/ui/CharacteristicCountsIcon';
import { InstagramEmbedProfile } from 'shared/ui/InstagramEmbed';
import { usePlaceReviews } from '../api/usePlaceReviews';
import { CoffeeShopSchema } from '../components/CoffeeShopSchema';
import cls from './DetailedPlaceCard.module.scss';

const DetailedPlaceCard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isViewInstProfile, setIsViewInstProfile] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showRateNow, setShowRateNow] = useState(false);

  const placeId = searchParams.get('id') || '';

  const { toggleFavorite } = useToggleFavorite(placeId);

  const { data: existData } = useGetAllPlacesQuery();
  const places = existData?.places ?? [];
  const existPlaceData = places.find((p) => p.properties.id === placeId);

  const { data: additionalPlaceData } = usePlaceQuery({ variables: { placeId } });

  const { data: placeReviewsData } = usePlaceReviews(placeId);

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

  useEffect(() => {
    if (existPlaceData?.geometry.coordinates) {
      setCurrentPlacePosition(existPlaceData.geometry.coordinates);
    }
  }, [existPlaceData?.geometry.coordinates]);

  useEffect(() => {
    document.title = existPlaceData?.properties?.name
      ? `${existPlaceData.properties.name} | Berlin Coffee Map`
      : 'Berlin Coffee Map';
    return () => {
      document.title = 'Berlin Coffee Map';
    };
  }, [existPlaceData?.properties?.name]);

  if (!placeId || !existPlaceData?.properties || !additionalPlaceData?.place) return null;

  const { averageRating, description, name, address, instagram, isFavorite } = existPlaceData.properties;

  const { ratingCount, characteristicCounts, openingHours } = additionalPlaceData.place.properties;

  const characteristicKeys = Array.from(characteristicsMap.keys());

  return (
    <div>
      <div className={cls.addressCompactView}>{address}</div>
      <div onClick={handleClose} className={cls.backDrop}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cls.detailsContainer}
        >
          <div className={cls.detailsContent}>
            {instagram ? (
              <InstagramEmbedProfile
                image={`${IMAGEKIT_CDN_URL}/places-main-img/${placeId}/main.jpg?tr=if-ar_gt_1,w-720,if-else,h-720,if-end`}
                normalView={isViewInstProfile}
                instaLink={instagram}
              />
            ) : (
              <div className={cls.backgroundImgWrapper}>
                <img
                  loading="lazy"
                  src={`${IMAGEKIT_CDN_URL}/places-main-img/${placeId}/main.jpg?tr=if-ar_gt_1,w-720,if-else,h-720,if-end`}
                  alt="Place image"
                  className={cls.backgroundImg}
                />
              </div>
            )}
            <div className={cls.iconsRow}>
              <div
                title={isFavorite ? 'Remove this place from favorites' : 'Add this place to favorites'}
                onClick={handleToggleFavorite}
                className={cls.iconFavWrapper}
              >
                <AddToFavButton isFavorite={Boolean(isFavorite)} />
              </div>
              {instagram && (
                <button
                  className={`${cls.viewInstagramButton} ${isViewInstProfile ? cls.darkColor : ''}`}
                  onClick={() => {
                    setIsViewInstProfile((prev) => !prev);
                  }}
                >
                  {isViewInstProfile ? 'Back to place info' : 'View Instagram'}
                </button>
              )}
            </div>
            <p className={cls.address}>{address}</p>
            <button className={cls.closeButton} onClick={handleClose}></button>
            <h2 className={cls.name}>{name}</h2>
            <div className={cls.charCounts}>
              {characteristicKeys.map((charKey) => (
                <CharacteristicCountsIcon
                  key={charKey}
                  characteristic={charKey as Characteristic}
                  characteristicData={characteristicCounts[charKey as Characteristic]}
                />
              ))}
            </div>

            {!showRateNow && (
              <HeaderDetailedPlaceCard
                averageRating={averageRating || 0}
                description={description}
                isHeaderVisible={isHeaderVisible}
              />
            )}
            <div className={cls.openingHoursContainer}>
              {isHeaderVisible && !showRateNow && <OpeningHours openingHours={openingHours ?? []} />}
              {isHeaderVisible && (
                <RateNow
                  setShowRateNow={setShowRateNow}
                  showRateNow={showRateNow}
                  placeId={placeId}
                  reviews={reviews}
                  characteristicCounts={characteristicCounts}
                />
              )}
            </div>

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
              averageRating={averageRating || 0}
              reviewCount={ratingCount}
              name={name}
              image={`${IMAGEKIT_CDN_URL}/places-main-img/${placeId}/main.jpg?tr=if-ar_gt_1,w-720,if-else,h-720,if-end`}
            />
            {/* for Google Rich Results */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPlaceCard;
