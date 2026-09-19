import { memo, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
import { setSearchQuery, useFiltersStore } from 'shared/stores/filters';
import { useKeyboardInset } from '../lib/useKeyboardInset';
import cls from './SearchPlaces.module.scss';

interface SearchPlacesProps {
  resultsCount: number;
  /** Rendered to the right of the input, e.g. the filters button */
  addon?: ReactNode;
}

const SearchPlacesComponent = ({ resultsCount, addon }: SearchPlacesProps) => {
  const searchQuery = useFiltersStore((state) => state.searchQuery);
  const isSearching = searchQuery.trim().length > 0;
  const [isFocused, setIsFocused] = useState(false);

  // Keep the results list visible above the mobile keyboard while typing
  useKeyboardInset(isFocused);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  return (
    <div className={cls.searchPlaces} role="search">
      <div className={cls.field}>
        <svg className={cls.searchIcon} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          className={cls.input}
          type="search"
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholder="Search coffee shops by name"
          aria-label="Search coffee shops by name"
          autoComplete="off"
          enterKeyHint="search"
        />
        {isSearching && (
          <span className={cls.resultsCount} aria-live="polite">
            {resultsCount} found
          </span>
        )}
        {searchQuery && (
          <button
            className={cls.clearButton}
            type="button"
            onClick={() => {
              setSearchQuery('');
            }}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
      {addon}
    </div>
  );
};

export const SearchPlaces = memo(SearchPlacesComponent);
