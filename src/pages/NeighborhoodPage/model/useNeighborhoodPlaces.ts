import { useFilteredPlacesQuery, useNeighborhoodShortlistsQuery } from 'shared/generated/graphql';
import { SHORTLIST_MIN_PLACES, TOP_RATED_MIN_RATING } from '../constants';
import { normalizeNeighborhoodName } from '../lib/normalizeNeighborhoodName';

type Status = 'loading' | 'error' | 'notFound' | 'loaded';

/**
 * Top rated, the Shortlists shown and every Place of one Neighborhood. `status`
 * is `notFound` when there is no Neighborhood in the URL or it has no Places at all.
 * Shortlists that fail to load are left out rather than failing the page.
 */
export const useNeighborhoodPlaces = (slug: string | undefined) => {
  const neighborhood = slug ? decodeURIComponent(slug) : undefined;
  const topRatedQuery = useFilteredPlacesQuery({
    variables: { neighborhood, minRating: TOP_RATED_MIN_RATING },
    fetchPolicy: 'cache-and-network',
    skip: !neighborhood,
  });
  const shortlistsQuery = useNeighborhoodShortlistsQuery({
    variables: { neighborhood: neighborhood ?? '' },
    fetchPolicy: 'cache-and-network',
    skip: !neighborhood,
  });
  const allQuery = useFilteredPlacesQuery({
    variables: { neighborhood },
    fetchPolicy: 'cache-and-network',
    skip: !neighborhood,
  });

  const topRated = topRatedQuery.data?.filteredPlaces;
  const shortlists = shortlistsQuery.data?.neighborhoodShortlists;
  const all = allQuery.data?.filteredPlaces;

  const shortlistsSettled = Boolean(shortlists ?? shortlistsQuery.error);

  const getStatus = (): Status => {
    if (!neighborhood) return 'notFound';
    if (topRated && shortlistsSettled && all) return all.total === 0 ? 'notFound' : 'loaded';
    if (topRatedQuery.error || allQuery.error) return 'error';
    return 'loading';
  };

  return {
    status: getStatus(),
    displayNeighborhood: all?.places[0]?.properties.neighborhood ?? (slug ? normalizeNeighborhoodName(slug) : ''),
    topRated: topRated?.places ?? [],
    shortlists: shortlists?.filter((shortlist) => shortlist.total >= SHORTLIST_MIN_PLACES) ?? [],
    all: all?.places ?? [],
    total: all?.total ?? 0,
  };
};
