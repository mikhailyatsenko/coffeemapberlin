import { usePlacesStore } from '../hooks';
import { type Place } from '../types';

export const setPlaces = (places: Place[]) => {
  usePlacesStore.setState({ places });
};

export const setFavoritePlaces = (favoritePlaces: Place[]) => {
  usePlacesStore.setState({ favoritePlaces });
};
