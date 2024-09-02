import { useEffect, useRef, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { usePlaces } from 'app/providers/PlacesDataProvider/ui/PlacesDataProvider';
import { RatingFilter } from 'entities/RatingFilter';
import { SearchPlacesInput } from 'entities/SearchPlacesInput';
import { SearchResultsTab } from 'entities/SearchResultsTab';
import cls from './SearchPlaces.module.scss';

export const SearchPlaces = () => {
  const { setMinRating, setSearchTerm, searchTerm, minRating, filterablePlaces } = usePlaces();
  const [isActive, setIsActive] = useState<boolean>(false);
  const SearchPlacesRef = useRef<HTMLInputElement>(null);

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
      {searchTerm && <SearchResultsTab filterdPlaces={filterablePlaces} onSelect={onResultSelectHandler} />}
    </div>
  );
};
