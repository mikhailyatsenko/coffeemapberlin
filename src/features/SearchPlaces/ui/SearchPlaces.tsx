import { useEffect, useRef, useState, useMemo } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { RatingFilter } from 'entities/RatingFilter';
import { SearchPlacesInput } from 'entities/SearchPlacesInput';
import { SearchResultsTab } from 'entities/SearchResultsTab';
import { usePlaces } from 'shared/context/PlacesData/usePlaces';
import { setPlaces, usePlacesStore } from 'shared/stores/places';
import cls from './SearchPlaces.module.scss';

export const SearchPlaces = () => {
  const { setMinRating, setSearchTerm, searchTerm, minRating } = usePlaces();
  const [isActive, setIsActive] = useState<boolean>(false);
  const SearchPlacesRef = useRef<HTMLInputElement>(null);
  const places = usePlacesStore((state) => state.places);

  const navigate = useNavigate();

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
      document.addEventListener('mouseup', handleClickOutside);
    };
  }, [isActive, setSearchTerm]);

  const filteredPlaces = useMemo(() => {
    return places
      .filter(
        (place) =>
          place.properties.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) &&
          (place.properties.averageRating || 0) >= minRating,
      )
      .sort((a, b) => (b?.properties?.averageRating ?? 0) - (a?.properties?.averageRating ?? 0));
  }, [places, searchTerm, minRating]);

  const onResultSelectHandler = (placeId: string) => {
    setIsActive(false);
    setSearchTerm('');
    navigate({
      pathname: '/details',
      search: createSearchParams({ id: placeId }).toString(),
    });
  };

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
      {isActive && <SearchResultsTab filterdPlaces={filteredPlaces} onSelect={onResultSelectHandler} />}
    </div>
  );
};
