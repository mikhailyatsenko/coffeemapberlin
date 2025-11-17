import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NeighborhoodPlaceCard } from 'entities/NeighborhoodPlaceCard';
import { useFilteredPlacesQuery } from 'shared/generated/graphql';
import { Spinner } from 'shared/ui/Loader';
import cls from './NeighborhoodPage.module.scss';

export const NeighborhoodPage = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const navigate = useNavigate();

  // Apollo хук нового запроса
  const { data, loading } = useFilteredPlacesQuery({
    variables: {
      neighborhood: neighborhood ? decodeURIComponent(neighborhood) : undefined,
      minRating: 4.5,
    },
    fetchPolicy: 'cache-and-network',
  });

  const displayNeighborhood =
    data?.filteredPlaces?.places?.[0]?.properties.neighborhood ||
    (neighborhood ? decodeURIComponent(neighborhood) : '');
  const places = data?.filteredPlaces?.places
    ? [...data.filteredPlaces.places].sort((a, b) => {
        const ratingA = a.properties.averageRating ?? -Infinity;
        const ratingB = b.properties.averageRating ?? -Infinity;
        return ratingB - ratingA;
      })
    : [];

  useEffect(() => {
    if (!loading && data && places.length === 0 && neighborhood) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [loading, data, places.length, neighborhood, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [neighborhood]);

  if (!neighborhood) {
    return (
      <main className={`${cls.NeighborhoodPage} container`}>
        <h1>Neighborhood not specified</h1>
      </main>
    );
  }

  return (
    <main className={`${cls.NeighborhoodPage} container`}>
      <div className={cls.header}>
        <h1>Best Coffee Places in {displayNeighborhood}</h1>
        <p className={cls.subtitle}>
          Places with a rating of 4.5 or higher ({places.length} {places.length === 1 ? 'place' : 'places'})
        </p>
      </div>
      {loading ? (
        <div className={cls.loadingState}>
          <Spinner size="lg" />
          <p>Loading places...</p>
        </div>
      ) : places.length === 0 ? (
        <div className={cls.emptyState}>
          <p>No places with a rating of 4.5 or higher found in this neighborhood yet.</p>
        </div>
      ) : (
        <div className={cls.placesList}>
          {places.map((place) => (
            <NeighborhoodPlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </main>
  );
};
