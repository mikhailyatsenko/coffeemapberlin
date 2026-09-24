import { useSearchStore } from 'shared/stores/search';

export const useBadgeSearch = () => useSearchStore((state) => state.query);
