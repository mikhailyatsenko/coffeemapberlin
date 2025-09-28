import { useGuestFavoritesStore } from '../hooks';

export const toggleGuestFavorite = (placeId: string) => {
  useGuestFavoritesStore.setState((state) => {
    const nextSet = new Set(state.ids);
    if (nextSet.has(placeId)) {
      nextSet.delete(placeId);
    } else {
      nextSet.add(placeId);
    }
    return { ids: Array.from(nextSet) };
  });
};

export const markGuestInfoShown = () => {
  useGuestFavoritesStore.setState({ infoShown: true });
};
