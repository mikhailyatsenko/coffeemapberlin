interface SearchState {
  query: string;
}

export const useSearchStore = (selector?: (state: SearchState) => unknown) => selector?.({ query: '' });
