import { describe, expect, it } from 'vitest';
import { type Place } from 'shared/stores/places';
import { filterPlacesByName } from './filterPlacesByName';

const makePlace = (name: string): Place => ({
  id: name,
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [13.4, 52.5] },
  properties: {
    id: name,
    name,
    description: '',
    address: '',
    image: '',
    instagram: '',
    isFavorite: false,
  },
});

const names = (places: Place[]) => places.map((place) => place.properties.name);

const places = [
  makePlace('Bonanza Coffee Mitte'),
  makePlace('Káffee Büro'),
  makePlace('Röststätte Berlin'),
  makePlace('Café Straße'),
  makePlace('THE BARN'),
];

describe('filterPlacesByName', () => {
  it('returns the same array when the query is empty or whitespace', () => {
    expect(filterPlacesByName(places, '')).toBe(places);
    expect(filterPlacesByName(places, '   ')).toBe(places);
  });

  it('matches a substring case-insensitively', () => {
    expect(names(filterPlacesByName(places, 'bonanza'))).toEqual(['Bonanza Coffee Mitte']);
    expect(names(filterPlacesByName(places, 'barn'))).toEqual(['THE BARN']);
    expect(names(filterPlacesByName(places, 'MITTE'))).toEqual(['Bonanza Coffee Mitte']);
  });

  it('ignores diacritics in both the name and the query', () => {
    expect(names(filterPlacesByName(places, 'kaffee buro'))).toEqual(['Káffee Büro']);
    expect(names(filterPlacesByName(places, 'röst'))).toEqual(['Röststätte Berlin']);
    expect(names(filterPlacesByName(places, 'roststatte'))).toEqual(['Röststätte Berlin']);
  });

  it('treats ß as ss', () => {
    expect(names(filterPlacesByName(places, 'strasse'))).toEqual(['Café Straße']);
    expect(names(filterPlacesByName(places, 'straße'))).toEqual(['Café Straße']);
  });

  it('trims the query', () => {
    expect(names(filterPlacesByName(places, '  barn  '))).toEqual(['THE BARN']);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterPlacesByName(places, 'zzz')).toEqual([]);
  });
});
