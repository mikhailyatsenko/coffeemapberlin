import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RateNow } from 'features/RateNow';
import { ReviewList } from 'features/ReviewList';
import { OpeningHours } from 'entities/OpeningHours';
import { useToggleFavorite } from 'shared/api';
import instagramIcon from 'shared/assets/instagram.svg';
import { IMAGEKIT_CDN_URL } from 'shared/constants';
import {
  useGetAllPlacesQuery,
  usePlaceQuery,
  type Characteristic,
  type GetAllPlacesQuery,
} from 'shared/generated/graphql';
import { setCurrentPlacePosition } from 'shared/stores/places';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { BadgePill } from 'shared/ui/BadgePill';
import { CharacteristicCountsIcon, characteristicsMap } from 'shared/ui/CharacteristicCountsIcon';
import { Modal } from 'shared/ui/Modal';
import { usePlaceReviews } from '../api/usePlaceReviews';
import { AverageRating } from '../components/AverageRating';
import { CoffeeShopSchema } from '../components/CoffeeShopSchema';
import cls from './NewDetailedPlaceCard.module.scss';

interface NewDetailedPlaceCardProps {
  placeId: string;
}

export const NewDetailedPlaceCard: React.FC<NewDetailedPlaceCardProps> = ({ placeId }) => {
  const navigate = useNavigate();

  const [showRateNow, setShowRateNow] = useState(false);

  // Precompute static keys to satisfy hooks order (before any early returns)
  const characteristicKeys = useMemo(() => Array.from(characteristicsMap.keys()), []);

  const { toggleFavorite } = useToggleFavorite(placeId);

  const { data: existData, loading: isPlacesLoading } = useGetAllPlacesQuery();
  const places = existData?.places ?? [];
  const existPlaceData = places.find((p: GetAllPlacesQuery['places'][number]) => p.properties.id === placeId);

  const { data: additionalPlaceData, loading: isPlaceLoading } = usePlaceQuery({
    variables: { placeId },
    skip: !placeId,
  });

  const { data: placeReviewsData } = usePlaceReviews(placeId);
  const reviews = placeReviewsData?.placeReviews.reviews ?? [];

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

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = '/places-images/default-place-img.jpg';
  }, []);

  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await toggleFavorite();
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    },
    [toggleFavorite],
  );

  const goBackToMap = useCallback(() => {
    navigate({ pathname: '/' });
  }, [navigate]);

  if (isPlacesLoading || isPlaceLoading) return null;
  if (!existPlaceData?.properties || !additionalPlaceData?.place) return null;

  const { averageRating, description, name, address, instagram, isFavorite, neighborhood } = existPlaceData.properties;
  const { ratingCount, characteristicCounts, openingHours, phone } = additionalPlaceData.place.properties;

  return (
    <div className={cls.page}>
      <div className={cls.breadcrumbs}>
        <button className={cls.backBtn} onClick={goBackToMap} aria-label="Back to map">
          <span>←</span>
          <span>Back to map</span>
        </button>
      </div>

      <header className={cls.header}>
        <div className={cls.briefInfo}>
          <AverageRating averageRating={averageRating} />

          <h1 className={cls.title}>{name}</h1>
          <div className={cls.charCounts}>
            {characteristicKeys.map((charKey) => (
              <CharacteristicCountsIcon
                key={charKey}
                characteristic={charKey as Characteristic}
                characteristicData={characteristicCounts[charKey as Characteristic]}
              />
            ))}
          </div>

          {description && <div className={cls.description}>{description}</div>}
          <div className={cls.headerActions}>
            {/* <div className={cls.block}> */}
            {/* <div className={cls.tags}>
                {characteristicKeys.map((charKey) => (
                  <BadgePill
                    key={charKey}
                    text={characteristicsMap.get(charKey) || charKey}
                    color="gray"
                    size="small"
                  />
                ))}
              </div> */}

            {/* </div> */}

            <button
              className={cls.primaryBtn}
              onClick={() => {
                setShowRateNow(true);
              }}
              type="button"
            >
              Rate place
            </button>
            <button
              className={cls.favBtn}
              onClick={handleToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <AddToFavButton size="medium" isFavorite={Boolean(isFavorite)} />
            </button>
          </div>
        </div>
        <div className={cls.headerImg}>
          <img
            loading="lazy"
            src={`${IMAGEKIT_CDN_URL}/places-main-img/${placeId}/main.jpg?tr=if-ar_gt_1,w-1440,if-else,h-720,if-end`}
            alt={`${name} main image`}
            className={cls.mainImg}
            onError={handleImageError}
          />
        </div>
      </header>

      <div className={cls.layout}>
        <main className={cls.main}>
          <div className={cls.block}>
            <h2 className={cls.blockTitle}>Reviews</h2>
            {showRateNow && (
              <Modal
                onClose={() => {
                  setShowRateNow(false);
                }}
              >
                <RateNow
                  setShowRateNow={setShowRateNow}
                  showRateNow={showRateNow}
                  placeId={placeId}
                  reviews={reviews}
                  characteristicCounts={characteristicCounts}
                />
              </Modal>
            )}
            <ReviewList
              showRateNow={showRateNow}
              setShowRateNow={setShowRateNow}
              reviews={reviews}
              placeId={placeId}
              isCompactView={false}
              setCompactView={() => {}}
            />
          </div>
        </main>

        <aside className={cls.sidebar}>
          <div className={cls.card}>
            {/* <h3 className={cls.cardTitle}>Place info</h3> */}
            {neighborhood ? (
              <BadgePill text={neighborhood} color="green" size="small" className={cls.neighborhood} />
            ) : null}
            <div className={cls.infoRow}>
              <span className={cls.infoLabel}>Address</span>
              <span className={cls.infoValue}>{address}</span>
            </div>
            {phone ? (
              <div className={cls.infoRow}>
                <span className={cls.infoLabel}>Phone</span>
                <a className={cls.infoValue} href={`tel:${phone}`} type="tel">
                  {phone}
                </a>
              </div>
            ) : null}
            <div className={cls.actionsCol}>
              <button className={cls.secondaryBtn} onClick={goBackToMap} type="button">
                Open on map
              </button>
              {instagram ? (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className={cls.secondaryBtn}
                  title="Open Instagram profile"
                >
                  <img className={cls.icon} src={instagramIcon} alt="" />
                  Open Instagram
                </a>
              ) : null}
              <div
                className={cls.inlineFav}
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <AddToFavButton isFavorite={Boolean(isFavorite)} />
                <span>{isFavorite ? 'In favorites' : 'Add to favorites'}</span>
              </div>
            </div>
          </div>
          {openingHours && openingHours.length > 0 ? (
            <div className={cls.block}>
              <h2 className={cls.blockTitle}>Opening hours</h2>
              <OpeningHours openingHours={openingHours ?? []} />
            </div>
          ) : null}
        </aside>
      </div>

      <CoffeeShopSchema
        address={address}
        averageRating={averageRating || 0}
        reviewCount={ratingCount}
        name={name}
        phone={phone}
        image={`${IMAGEKIT_CDN_URL}/places-main-img/${placeId}/main.jpg?tr=if-ar_gt_1,w-720,if-else,h-720,if-end`}
      />
    </div>
  );
};
