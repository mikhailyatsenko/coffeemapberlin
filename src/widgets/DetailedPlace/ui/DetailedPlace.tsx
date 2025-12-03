import clsx from 'clsx';
import { driver } from 'driver.js';
import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddTextReviewForm } from 'features/AddTextReview';
import { RateNow } from 'features/RateNow';
import { ReviewList } from 'features/ReviewList';
import { OpeningHours } from 'entities/OpeningHours';
import instagramIcon from 'shared/assets/instagram.svg';
import logo from 'shared/assets/logo.svg';
import { IMAGEKIT_CDN_URL } from 'shared/constants';
import { usePlaceQuery } from 'shared/generated/graphql';
import { type Characteristic } from 'shared/generated/graphql';
import { setCurrentPlacePosition } from 'shared/stores/places';
import { AddToFavButton } from 'shared/ui/AddToFavButton';
import { BadgePill } from 'shared/ui/BadgePill';
import { CharacteristicCountsIcon, characteristicsMap } from 'shared/ui/CharacteristicCountsIcon';
import { usePlaceReviews } from '../api/usePlaceReviews';
import { AverageRating } from '../components/AverageRating';
import { CoffeeShopSchema } from '../components/CoffeeShopSchema';
import { ErrorPlace } from '../components/ErrorPlace';
import { ImageSlider } from '../components/ImageSlider/ui';
import { NewDetailedPlaceCardSkeleton } from '../components/NewDetailedPlaceCardSkeleton';
import cls from './DetailedPlace.module.scss';
import 'driver.js/dist/driver.css';

const DetailedPlaceComponent: React.FC<{ placeId: string }> = ({ placeId }) => {
  const navigate = useNavigate();

  const [showRateNow, setShowRateNow] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editInitialText, setEditInitialText] = useState('');

  // Precompute static keys to satisfy hooks order (before any early returns)
  const characteristicKeys = useMemo(() => Array.from(characteristicsMap.keys()), []);

  const {
    data: placeData,
    loading: isPlaceLoading,
    error: placeError,
  } = usePlaceQuery({
    variables: { placeId },
    skip: !placeId,
  });

  // Extract all tags with true values from additionalInfo
  const tags = useMemo(() => {
    if (!placeData?.place?.properties?.additionalInfo) return [];

    const allTags: string[] = [];

    Object.values(placeData.place.properties.additionalInfo as Record<string, unknown>).forEach((category: unknown) => {
      if (Array.isArray(category)) {
        category.forEach((item: unknown) => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item as Record<string, unknown>).forEach(([key, value]) => {
              if (value === true) {
                allTags.push(key);
              }
            });
          }
        });
      }
    });

    return allTags;
  }, [placeData?.place?.properties?.additionalInfo]);

  const { data: placeReviewsData } = usePlaceReviews(placeData?.place?.properties ? placeId : null);
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
    document.title = placeData?.place?.properties?.name
      ? `${placeData?.place.properties.name} | Reviews, Photos, Contacts`
      : 'Berlin Coffee Map';
    return () => {
      document.title = 'Berlin Coffee Map';
    };
  }, [placeData?.place?.properties?.name]);

  const openOnMap = useCallback(() => {
    if (placeData?.place?.geometry.coordinates) {
      // send a new array reference to force store subscribers to react even if values are equal
      setCurrentPlacePosition(placeData.place.geometry.coordinates as [number, number]);
    }

    navigate({ pathname: '/' });
  }, [navigate, placeData?.place?.geometry.coordinates]);

  const openOnGoogleMaps = useCallback(() => {
    if (placeData?.place?.properties?.googleId) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          placeData.place.properties.name || '',
        )}&query_place_id=${placeData.place.properties.googleId}`,
        '_blank',
        'noopener,noreferrer',
      );
    }
  }, [placeData?.place?.properties?.googleId, placeData?.place?.properties?.name]);

  useEffect(() => {
    if (isPlaceLoading || !placeData?.place?.properties) {
      return;
    }

    const TOUR_STORAGE_KEY = 'detailed-place-tour-completed';
    const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY) === 'true';

    if (hasSeenTour) {
      return;
    }

    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          element: '#favorite-button',
          popover: {
            title: 'Add to favorites',
            description: 'Save places you love for quick access later',
          },
        },
        {
          element: '#rate-place',
          popover: { title: 'Rate this place', description: 'Share your experience and rate the coffee shop' },
        },
        {
          element: '#review-form',
          popover: {
            title: 'Write a review',
            description: 'Share your thoughts and help others discover great coffee',
          },
        },
        {
          element: '#google-maps',
          popover: { title: 'Open in Google Maps', description: 'Get directions or view in Google Maps' },
        },
      ],
      onPopoverRender: () => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      },
      onCloseClick: (_element, _step, opts) => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        opts.driver.destroy();
      },
      onNextClick: (_element, _step, opts) => {
        if (opts.driver.isLastStep()) {
          localStorage.setItem(TOUR_STORAGE_KEY, 'true');
          opts.driver.destroy();
        } else {
          opts.driver.moveNext();
        }
      },
    });

    driverObj.drive();

    return () => {
      driverObj.destroy();
    };
  }, [isPlaceLoading, placeData?.place?.properties]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [placeData?.place.id]);

  if (placeError) {
    return <ErrorPlace error={placeError} />;
  }

  if (isPlaceLoading || !placeData?.place?.properties) return <NewDetailedPlaceCardSkeleton />;

  const { averageRating, description, name, address, instagram, isFavorite, neighborhood, images, website } =
    placeData.place.properties;
  const { ratingCount, characteristicCounts, openingHours, phone } = placeData.place.properties;
  return (
    <div className={cls.page}>
      <header className={cls.header}>
        <div className={clsx(cls.briefInfo, cls.block)}>
          <AverageRating ratingCount={ratingCount} averageRating={averageRating} />

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
            <RateNow
              id="rate-place"
              setShowRateNow={setShowRateNow}
              showRateNow={showRateNow}
              placeId={placeId}
              reviews={displayedReviews}
              characteristicCounts={characteristicCounts}
            />

            <AddToFavButton
              id="favorite-button"
              theme="square"
              placeName={name}
              placeId={placeId}
              size="medium"
              isFavorite={isFavorite}
            />
          </div>
        </div>
        <div className={cls.headerImg}>
          {neighborhood ? (
            <BadgePill text={neighborhood} color="green" size="small" className={cls.neighborhood} />
          ) : null}

          <ImageSlider images={images || []} placeName={name} className={cls.mainImg} />
        </div>
      </header>

      <div className={cls.layout}>
        <main className={cls.main}>
          <div className={cls.block}>
            <h2 className={cls.blockTitle}>Reviews</h2>

            {(isEditingReview || !ownReview?.text) && (
              <AddTextReviewForm
                id="review-form"
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
                <img className={cls.icon} src={logo} alt="" />
                Show on 3.Welle map
              </button>
              <button id="google-maps" className={cls.secondaryBtn} onClick={openOnGoogleMaps} type="button">
                <img className={cls.icon} src="/google-maps.svg" alt="" />
                Open on Google Maps
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

              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={cls.secondaryBtn}
                  title="Open website"
                >
                  <span className={cls.icon}>🌐</span>
                  Open Website
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
          {tags.length > 0 && (
            <div className={cls.block}>
              <h3 className={cls.blockTitle}>Features</h3>
              <div className={cls.tagsContainer}>
                {tags.map((tag, index) => (
                  <BadgePill key={index} text={tag} color="purple" size="small" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className={cls.breadcrumbs}>
        <a href="/" className={cls.backBtn} aria-label="Back to map">
          <span>←</span>
          <span>Back to map</span>
        </a>
      </div>

      <CoffeeShopSchema
        address={address}
        averageRating={averageRating || 0}
        reviewCount={ratingCount}
        name={name}
        phone={phone}
        image={images?.length ? `${IMAGEKIT_CDN_URL}/${images[0]}` : undefined}
      />
    </div>
  );
};

export const DetailedPlace = memo(DetailedPlaceComponent, (prevProps, nextProps) => {
  return prevProps.placeId === nextProps.placeId;
});
