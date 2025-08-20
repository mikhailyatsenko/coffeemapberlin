import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RatingFilter } from 'entities/RatingFilter';
import { SearchPlacesInput } from 'entities/SearchPlacesInput';
import { SearchResultsTab } from 'entities/SearchResultsTab';
import { usePlacesStore, setFilteredPlaces } from 'shared/stores/places';
import cls from './SearchPlaces.module.scss';

export const SearchPlaces = () => {
  const [minRating, setMinRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const SearchPlacesRef = useRef<HTMLInputElement>(null);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);

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

  useEffect(() => {
    if (isActive) {
      setFilteredPlaces({ searchTerm, minRating });
    } else {
      setFilteredPlaces(null);
    }
  }, [searchTerm, minRating, isActive]);

  const onResultSelectHandler = (placeId: string) => {
    setIsActive(false);
    setSearchTerm('');
    navigate({
      pathname: placeId,
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
      {isActive && filteredPlaces && (
        <SearchResultsTab filteredPlaces={filteredPlaces} onSelect={onResultSelectHandler} />
      )}
    </div>
  );
};
