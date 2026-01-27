import { usePlacesStore } from '../hooks';
import { type PlacesState, type Place } from '../types';

export const PAGE_SIZE = 60;
export const INITIAL_OFFSET = 0;

export const setPlaces = (places: Place[] | ((prev: Place[]) => Place[])) => {
  usePlacesStore.setState((state) => ({
    places: typeof places === 'function' ? places(state.places) : places,
  }));
};

export const setShowFavorites = (show: boolean) => {
  usePlacesStore.setState({ showFavorites: show });
};

export const setInitialBatchLoaded = (loaded: boolean) => {
  usePlacesStore.setState({ hasInitialBatchLoaded: loaded });
};

export const setMoreBatchLoaded = (loaded: boolean) => {
  usePlacesStore.setState({ hasMoreBatchLoaded: loaded });
};

export const toggleFavorite = (placeId: string) => {
  usePlacesStore.setState((state) => {
    const updatedPlaces = state.places.map((place) =>
      place.id === placeId
        ? {
            ...place,
            properties: {
              ...place.properties,
              isFavorite: !place.properties.isFavorite,
            },
          }
        : place,
    );
    return { places: updatedPlaces };
  });
};

export const setCurrentPlacePosition = (position: PlacesState['currentPlacePosition']) => {
  usePlacesStore.setState({ currentPlacePosition: position });
};

export const revalidatePlaces = () => {
  setPlaces([]);
  // setFilteredPlaces(null);
  setShowFavorites(false);
  setCurrentPlacePosition(null);
  setInitialBatchLoaded(false);
  setMoreBatchLoaded(false);
};
