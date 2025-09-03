import { memo, useMemo } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { type SEOPlacesListProps } from '../types';
import cls from './SEOPlacesList.module.scss';

const SEOPlacesListComponent = ({ places }: SEOPlacesListProps) => {
  // Memoize structured data to avoid regeneration on every render
  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Coffee Places in Berlin',
      description: 'A curated list of the best coffee places in Berlin',
      numberOfItems: places.length,
      itemListElement: places.map((place, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LocalBusiness',
          '@id': `https://berlincoffeemap.com/place/${place.properties.id}`,
          name: place.properties.name,
          description: place.properties.description,
          address: {
            '@type': 'PostalAddress',
            streetAddress: place.properties.address,
            addressLocality: 'Berlin',
            addressCountry: 'DE',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: place.geometry.coordinates[1],
            longitude: place.geometry.coordinates[0],
          },
          aggregateRating: place.properties.averageRating
            ? {
                '@type': 'AggregateRating',
                ratingValue: place.properties.averageRating,
                ratingCount: 1,
              }
            : undefined,
          url: `https://berlincoffeemap.com/place/${place.properties.id}`,
          image: place.properties.image
            ? `https://ik.imagekit.io/berlincoffeemap/places-main-img/${place.properties.id}/main.jpg`
            : undefined,
          sameAs: place.properties.instagram ? [place.properties.instagram] : undefined,
        },
      })),
    }),
    [places],
  );

  // Memoize places list to avoid regeneration
  const placesList = useMemo(
    () =>
      places.map((place) => {
        const placePath = generatePath(`/${RoutePaths.placePage}`, { id: place.properties.id });
        return (
          <li key={place.properties.id} className={cls.placeItem}>
            <article className={cls.placeArticle}>
              <h2>
                <Link to={placePath} className={cls.placeLink}>
                  {place.properties.name}
                </Link>
              </h2>
              <p className={cls.placeDescription}>{place.properties.description}</p>
              <address className={cls.placeAddress}>{place.properties.address}</address>
              {place.properties.averageRating && (
                <div className={cls.placeRating}>Rating: {place.properties.averageRating}/5</div>
              )}
              {place.properties.neighborhood && (
                <div className={cls.placeNeighborhood}>Neighborhood: {place.properties.neighborhood}</div>
              )}
            </article>
          </li>
        );
      }),
    [places],
  );

  return (
    <>
      {/* Structured data for search engines */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className={cls.seoPlacesList}>
        {/* Semantic HTML structure for search engines */}
        <section className={cls.placesSection}>
          <h1 className={cls.srOnly}>Coffee Places in Berlin</h1>
          <p className={cls.srOnly}>
            Discover the best coffee places in Berlin. Each location is carefully curated and includes ratings,
            addresses, and detailed information to help you find your perfect cup of coffee.
          </p>

          <ul className={cls.placesList}>{placesList}</ul>
        </section>
      </div>
    </>
  );
};

export const SEOPlacesList = memo(SEOPlacesListComponent);
export default SEOPlacesList;
