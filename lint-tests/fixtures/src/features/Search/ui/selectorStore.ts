import { useSearchStore } from 'shared/stores/search';

export const useSearch = () => useSearchStore((state) => state.query);
