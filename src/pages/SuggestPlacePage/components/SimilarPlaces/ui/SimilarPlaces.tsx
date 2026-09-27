import { generatePath, Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { useSimilarPlaces } from '../model/useSimilarPlaces';
import cls from './SimilarPlaces.module.scss';

interface SimilarPlacesProps {
  name: string;
}

/** "Is it one of these?": Places already on the map with a similar name. Only a hint. */
export const SimilarPlaces = ({ name }: SimilarPlacesProps) => {
  const places = useSimilarPlaces(name);

  if (!places.length) return null;

  return (
    <section className={cls.SimilarPlaces} aria-labelledby="similar-places-title">
      <p id="similar-places-title" className={cls.title}>
        Is it one of these?
      </p>
      <ul className={cls.list}>
        {places.map((place) => (
          <li key={place.id}>
            <Link to={generatePath(`/${RoutePaths.placePage}`, { id: place.properties.id })}>
              {place.properties.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
