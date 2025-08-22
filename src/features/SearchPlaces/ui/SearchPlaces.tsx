import { debounce } from 'lodash-es';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RatingFilter } from 'entities/RatingFilter';
import { SearchPlacesInput } from 'entities/SearchPlacesInput';
import { SearchResultsTab } from 'entities/SearchResultsTab';
import { usePlacesStore, setFilteredPlaces } from 'shared/stores/places';
import cls from './SearchPlaces.module.scss';

const debouncedSetFilteredPlaces = debounce((searchTerm: string, minRating: number, isActive: boolean) => {
  if (isActive) {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    const hasRealFilter = normalizedTerm.length >= 2 || minRating > 0;

    if (hasRealFilter) {
      setFilteredPlaces({ searchTerm: normalizedTerm, minRating });
    } else {
      setFilteredPlaces(null);
    }
  }
}, 250);

export const SearchPlaces = () => {
  const [minRating, setMinRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const SearchPlacesRef = useRef<HTMLInputElement>(null);
  const places = usePlacesStore((state) => state.places);

  const navigate = useNavigate();

  const normalizedTerm: string = searchTerm.trim().toLowerCase();

  const resultsToShow = useMemo(() => {
    const term: string = normalizedTerm;
    const min: number = minRating;

    const base = places ?? [];

    const filtered = base.filter((place) => {
      const name = (place.properties.name ?? '').toLowerCase();
      const rating = place.properties.averageRating ?? 0;
      const matchesName = term.length === 0 ? true : name.includes(term);
      const matchesRating = rating >= min;
      return matchesName && matchesRating;
    });

    // Keep results unsliced; virtualization will handle rendering performance
    const sorted = filtered.sort((a, b) => (b?.properties?.averageRating ?? 0) - (a?.properties?.averageRating ?? 0));

    return sorted;
  }, [places, normalizedTerm, minRating]);

  useEffect(() => {
    debouncedSetFilteredPlaces(searchTerm, minRating, isActive);
  }, [searchTerm, minRating, isActive]);

  useEffect(() => {
    if (isActive) {
      SearchPlacesRef.current?.focus();
    }

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsActive(false);
        setSearchTerm('');
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (SearchPlacesRef.current && !SearchPlacesRef.current.contains(event.target as Node)) {
        setIsActive(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [isActive, setSearchTerm]);

  const onResultSelectHandler = useCallback(
    (placeId: string) => {
      setIsActive(false);
      setSearchTerm('');
      navigate({
        pathname: placeId,
      });
    },
    [navigate],
  );

  return (
    <div
      onClick={() => {
        setIsActive(true);
      }}
      className={`${cls.SearchPlaces} ${isActive ? cls.smallScreensSearch : ''}`}
      ref={SearchPlacesRef}
    >
      <SearchPlacesInput searchValue={searchTerm} setValueHandler={setSearchTerm} isActive={isActive} />
      {isActive && (
        <div className={cls.filter}>
          <RatingFilter filterRating={minRating} setFilterRating={setMinRating} />
        </div>
      )}
      {isActive && resultsToShow.length > 0 && (
        <SearchResultsTab filteredPlaces={resultsToShow} onSelect={onResultSelectHandler} />
      )}
    </div>
  );
};
