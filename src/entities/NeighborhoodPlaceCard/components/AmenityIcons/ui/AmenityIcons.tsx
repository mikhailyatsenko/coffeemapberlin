import { type ShortlistId } from 'shared/generated/graphql';
import { AMENITIES } from '../constants';
import cls from './AmenityIcons.module.scss';

interface AmenityIconsProps {
  /** The Shortlists whose Amenities the Place has, in the server's order. */
  shortlistIds: readonly ShortlistId[];
}

/** A small icon for each Shortlist Amenity of a Place; nothing for a Place without any. */
export const AmenityIcons = ({ shortlistIds }: AmenityIconsProps) => {
  // A newer server may send a Shortlist this build has no icon for; it is left out.
  const known = shortlistIds.filter((id) => id in AMENITIES);
  if (known.length === 0) return null;

  return (
    <ul className={cls.icons} aria-label="Amenities">
      {known.map((id) => {
        const { name, Icon } = AMENITIES[id];
        return (
          <li key={id} className={cls.item} title={name}>
            <Icon className={cls.icon} role="img" aria-label={name} />
          </li>
        );
      })}
    </ul>
  );
};
