import { type PlacesDataWithGeo } from 'features/LoadMap/types';

export interface MainMapProps {
  placesGeo: PlacesDataWithGeo;
  moreDataLoading: boolean;
}
