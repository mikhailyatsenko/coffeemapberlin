import { useEffect, useRef } from 'react';
import { useGetPlacesQuery, useGetPlacesLazyQuery } from 'shared/generated/graphql';
import { setPlaces } from 'shared/stores/places';
import { PAGE_SIZE, INITIAL_OFFSET } from '../constants';

export const usePlacesDataLoader = () => {
  const isInitialLoadComplete = useRef(false);
  const isMoreDataLoaded = useRef(false);

  const { data: initialData, loading: initialLoading } = useGetPlacesQuery({
    variables: { limit: PAGE_SIZE, offset: INITIAL_OFFSET },
    fetchPolicy: 'cache-first',
  });

  const [fetchMore, { data: moreData, loading: moreDataLoading }] = useGetPlacesLazyQuery();

  useEffect(() => {
    if (!initialData?.places || isInitialLoadComplete.current) return;

    const initialPlaces = initialData.places.places ?? [];

    setPlaces(initialPlaces);
    isInitialLoadComplete.current = true;

    const totalPlaces = initialData.places.total;
    if (totalPlaces > PAGE_SIZE) {
      fetchMore({
        variables: {
          limit: totalPlaces - PAGE_SIZE,
          offset: PAGE_SIZE,
        },
      });
    }
  }, [initialData, fetchMore]);

  useEffect(() => {
    if (!moreData?.places?.places?.length || isMoreDataLoaded.current) return;

    const additionalPlaces = moreData.places.places;

    setPlaces((prev) => [...prev, ...additionalPlaces]);
    isMoreDataLoaded.current = true;
  }, [moreData]);

  return {
    initialLoading,
    moreDataLoading,
  };
};
