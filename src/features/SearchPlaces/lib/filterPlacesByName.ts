import { type Place } from 'shared/stores/places';

// Lowercase and strip diacritics so "rost" matches "Röststätte"
const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').toLowerCase().trim();

export const filterPlacesByName = (places: Place[], query: string) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return places;
  }
  return places.filter((place) => normalize(place.properties.name).includes(normalizedQuery));
};
