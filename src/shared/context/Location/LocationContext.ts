import { type Position } from 'geojson';
import { createContext } from 'react';

export interface LocationContextProps {
  location?: Position;
  setLocation?: (location: Position) => void;
}

export const LocationContext = createContext<LocationContextProps>({});
