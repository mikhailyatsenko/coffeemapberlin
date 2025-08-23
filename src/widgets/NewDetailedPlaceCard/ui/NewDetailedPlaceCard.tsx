import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
// TODO: fix somehow
// eslint-disable-next-line boundaries/element-types
import { NotFoundPage } from 'pages/NotFoundPage';
import { AddTextReviewForm } from 'features/AddTextReview';
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
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import { usePlaceReviews } from '../api/usePlaceReviews';
import { AverageRating } from '../components/AverageRating';
import { CoffeeShopSchema } from '../components/CoffeeShopSchema';
import { NewDetailedPlaceCardSkeleton } from '../components/NewDetailedPlaceCardSkeleton';
import cls from './NewDetailedPlaceCard.module.scss';

interface NewDetailedPlaceCardProps {
  placeId: string;
}

const NewDetailedPlaceCardComponent: React.FC<NewDetailedPlaceCardProps> = ({ placeId }) => {
  const navigate = useNavigate();

  const [showRateNow, setShowRateNow] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editInitialText, setEditInitialText] = useState('');

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
  const ownReview = placeReviewsData?.placeReviews.ownReview;
  const displayedReviews = useMemo(() => {
    const own = placeReviewsData?.placeReviews.ownReview;
    const others = placeReviewsData?.placeReviews.othersSorted ?? [];
    if (isEditingReview && own) return others;
    return own ? [own, ...others] : others;
  }, [isEditingReview, placeReviewsData]);

  const handleEditReviewInline = useCallback((text: string) => {
    setEditInitialText(text || '');
    setIsEditingReview(true);
  }, []);

  useEffect(() => {
    document.title = existPlaceData?.properties?.name
      ? `${existPlaceData.properties.name} | Berlin Coffee Map`
      : 'Berlin Coffee Map';
    return () => {
      document.title = 'Berlin Coffee Map';
    };
  }, [existPlaceData?.properties?.name]);

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

  const openOnMap = useCallback(() => {
    if (existPlaceData?.geometry.coordinates) {
      // send a new array reference to force store subscribers to react even if values are equal
      setCurrentPlacePosition([...existPlaceData.geometry.coordinates]);
    }

    navigate({ pathname: '/' });
  }, [navigate, existPlaceData?.geometry.coordinates]);

  if (isPlacesLoading || isPlaceLoading) return <NewDetailedPlaceCardSkeleton />;
  if (!existPlaceData?.properties || !additionalPlaceData?.place) return <NotFoundPage />;

  const { averageRating, description, name, address, instagram, isFavorite, neighborhood } = existPlaceData.properties;
  const { ratingCount, characteristicCounts, openingHours, phone } = additionalPlaceData.place.properties;
  return (
    <div className={cls.page}>
      <header className={cls.header}>
        <div className={clsx(cls.briefInfo, cls.block)}>
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

            <RateNow
              setShowRateNow={setShowRateNow}
              showRateNow={showRateNow}
              placeId={placeId}
              reviews={displayedReviews}
              characteristicCounts={characteristicCounts}
            />

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
          {neighborhood ? (
            <BadgePill text={neighborhood} color="green" size="small" className={cls.neighborhood} />
          ) : null}
          <ImgWithLoader
            loading="lazy"
            src={`${IMAGEKIT_CDN_URL}/places-main-img/${placeId}/main.jpg?tr=if-ar_gt_1,w-1440,if-else,h-720,if-end`}
            alt={`${name} main image`}
            className={cls.mainImg}
            errorFallbackUrl="/places-images/default-place-img.jpg"
          />
        </div>
      </header>

      <div className={cls.layout}>
        <main className={cls.main}>
          <div className={cls.block}>
            <h2 className={cls.blockTitle}>Reviews</h2>

            {(isEditingReview || !ownReview?.text) && (
              <AddTextReviewForm
                placeId={placeId}
                initialValue={isEditingReview ? editInitialText : ''}
                onSubmitted={() => {
                  setIsEditingReview(false);
                }}
                onCancel={() => {
                  setIsEditingReview(false);
                }}
              />
            )}

            <ReviewList
              reviews={displayedReviews}
              placeId={placeId}
              isCompactView={false}
              setCompactView={() => {}}
              onEditReview={handleEditReviewInline}
            />
          </div>
        </main>

        <aside className={cls.sidebar}>
          <div className={cls.block}>
            <h3 className={cls.blockTitle}>Place info</h3>

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
              <button className={cls.secondaryBtn} onClick={openOnMap} type="button">
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
              {/* <div
                className={cls.inlineFav}
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <AddToFavButton isFavorite={Boolean(isFavorite)} />
                <span>{isFavorite ? 'In favorites' : 'Add to favorites'}</span>
              </div> */}
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

      <div className={cls.breadcrumbs}>
        <button className={cls.backBtn} onClick={goBackToMap} aria-label="Back to map">
          <span>←</span>
          <span>Back to map</span>
        </button>
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

export const NewDetailedPlaceCard = memo(NewDetailedPlaceCardComponent, (prevProps, nextProps) => {
  return prevProps.placeId === nextProps.placeId;
});
