import { useApolloClient } from '@apollo/client';
import { useState } from 'react';

import { type CardContributionProps } from '../types';

/**
 * A card's states: beans while there is no Rating or the person is changing it,
 * otherwise their Rating. A tap shows the Rating at once; a failed save brings the
 * beans back. A confirmed Rating goes into the Place's cached `ownRating`, so every
 * card of the Place on the page shows it.
 */
export const useCardContribution = ({ placeId, ownRating }: Pick<CardContributionProps, 'placeId' | 'ownRating'>) => {
  const { cache } = useApolloClient();
  // The Rating tapped on this card, shown before the cache catches up.
  const [tappedRating, setTappedRating] = useState<number | null>(null);
  const [ratingFromCaller, setRatingFromCaller] = useState(ownRating);
  if (ownRating !== ratingFromCaller) {
    setRatingFromCaller(ownRating);
    setTappedRating(null);
  }
  const [isChanging, setIsChanging] = useState(false);

  const currentRating = tappedRating ?? ownRating ?? null;
  const showsBeans = isChanging || currentRating === null;

  const handleRate = (rating: number) => {
    setTappedRating(rating);
    setIsChanging(false);
  };

  const handleSaved = (rating: number) => {
    // Only `ownRating`: the Average rating and the cards' order stay as this page view showed them.
    cache.modify({
      id: cache.identify({ __typename: 'PlaceProperties', id: placeId }),
      fields: { ownRating: () => rating },
    });
  };

  const handleSaveFailed = () => {
    setTappedRating(null);
    setIsChanging(true);
  };

  const startChange = () => {
    setIsChanging(true);
  };

  return { currentRating, showsBeans, handleRate, handleSaved, handleSaveFailed, startChange };
};
