import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FilteredPlacesDocument, GetPlacesDocument, type GetPlacesQuery } from 'shared/generated/graphql';
import { resetFilters, setMinRating, setNeighborhood, setSelectedTags } from 'shared/stores/filters';
import { usePlacesStore } from 'shared/stores/places';
import { MainPage } from './MainPage';

type Place = GetPlacesQuery['places']['places'][number];

/** Stands in for the map: lists the Places it is given. */
vi.mock('widgets/Map', () => ({
  MainMapLazy: ({ placesGeo }: { placesGeo: { features: Place[] } }) => (
    <ul aria-label="Map">
      {placesGeo.features.map((place) => (
        <li key={place.id}>{place.properties.name}</li>
      ))}
    </ul>
  ),
}));
vi.mock('widgets/PlacesList', () => ({ PlacesList: () => null }));

const place = (id: string): Place => ({
  __typename: 'Place',
  id,
  type: 'Feature',
  geometry: { __typename: 'Geometry', type: 'Point', coordinates: [13.4, 52.5] },
  properties: {
    __typename: 'PlaceProperties',
    id,
    name: `Place ${id}`,
    description: '',
    address: '',
    image: '',
    instagram: '',
    averageRating: 4.2,
    isFavorite: false,
    googleId: null,
    neighborhood: 'Mitte',
  },
});

const getPlacesMock = (variables: Record<string, unknown>, places: Place[]): MockedResponse => ({
  request: { query: GetPlacesDocument, variables },
  result: { data: { places: { __typename: 'PlacesResult', places, total: places.length } } },
});

const filteredResult = vi.fn(() => ({
  data: {
    filteredPlaces: {
      __typename: 'FilteredPlacesResult',
      places: [{ ...place('dog'), properties: { ...place('dog').properties, ratingCount: 3, favoriteCount: 0 } }],
      total: 1,
    },
  },
}));

const renderMap = () =>
  render(
    <MockedProvider
      mocks={[
        getPlacesMock({ limit: 60, offset: 0 }, [place('a'), place('b'), place('dog')]),
        getPlacesMock({ offset: 60 }, []),
        {
          request: {
            query: FilteredPlacesDocument,
            variables: { minRating: 4, neighborhood: ['Mitte'], additionalInfo: ['Dogs allowed'] },
          },
          result: filteredResult,
        },
      ]}
    >
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    </MockedProvider>,
  );

const mapPlaces = () =>
  within(screen.getByRole('list', { name: 'Map' }))
    .queryAllByRole('listitem')
    .map((item) => item.textContent);

describe('MainPage', () => {
  afterEach(() => {
    resetFilters();
    filteredResult.mockClear();
    usePlacesStore.setState({
      places: [],
      filteredPlaces: null,
      hasInitialBatchLoaded: false,
      hasMoreBatchLoaded: false,
    });
  });

  it('shows the filtered Places at once when it opens with Filters already active', async () => {
    setNeighborhood(['Mitte']);
    setSelectedTags(['Dogs allowed']);
    setMinRating(4);
    renderMap();

    await vi.waitFor(() => {
      expect(mapPlaces()).toEqual(['Place dog']);
    });
    expect(filteredResult).toHaveBeenCalledTimes(1);
  });

  it('drops the results of earlier Filters instead of showing them until the new ones load', async () => {
    usePlacesStore.setState({ filteredPlaces: [place('stale')] });
    setNeighborhood(['Mitte']);
    setSelectedTags(['Dogs allowed']);
    setMinRating(4);
    renderMap();

    expect(mapPlaces()).not.toContain('Place stale');
    await vi.waitFor(() => {
      expect(mapPlaces()).toEqual(['Place dog']);
    });
  });

  it('shows every Place and fetches nothing filtered when it opens without Filters', async () => {
    renderMap();

    await vi.waitFor(() => {
      expect(mapPlaces()).toEqual(['Place a', 'Place b', 'Place dog']);
    });
    expect(filteredResult).not.toHaveBeenCalled();
  });
});
