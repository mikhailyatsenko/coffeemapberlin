import { type GetPlacesQuery } from 'shared/generated/graphql';

export interface SEOPlacesListProps {
  places: GetPlacesQuery['places']['places'];
}
