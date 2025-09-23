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

  // Memoize places list to avoid regeneration - simplified for 460 items
  const placesList = useMemo(
    () =>
      places.map((place) => {
        const placePath = generatePath(`/${RoutePaths.placePage}`, { id: place.properties.id });
        return (
          <li key={place.properties.id}>
            <Link to={placePath}>
              {place.properties.name} - {place.properties.address}
            </Link>
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
        {/* Simplified structure for 460 items */}
        <h1 className={cls.srOnly}>Coffee Places in Berlin</h1>
        <ul className={cls.placesList}>{placesList}</ul>
      </div>
    </>
  );
};

export const SEOPlacesList = memo(SEOPlacesListComponent);
export default SEOPlacesList;
