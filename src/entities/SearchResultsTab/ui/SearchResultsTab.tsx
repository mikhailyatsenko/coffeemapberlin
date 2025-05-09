import { type PlaceResponse } from 'shared/types';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import cls from './SearchResultsTab.module.scss';

interface SearchResultsTabProps {
  filterdPlaces: PlaceResponse;
  onSelect: (id: string) => void;
}

export const SearchResultsTab = ({ filterdPlaces, onSelect }: SearchResultsTabProps) => {
  return (
    <div className={cls.SearchResultsTab}>
      {filterdPlaces.map((place) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(place.properties.id);
          }}
          key={place.properties.id}
          className={`${cls.resultPlace} ${cls.resultPlaceActive}`}
        >
          <div className={cls.placeName}>{place.properties.name}</div>
          <RatingWidget isClickable={false} rating={place.properties.averageRating} />
          <div className={cls.placeAddress}>{place.properties.address}</div>
        </div>
      ))}
    </div>
  );
};
