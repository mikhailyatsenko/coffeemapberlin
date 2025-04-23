import { type Position } from 'geojson';
import { type PropsWithChildren, useState, type FC } from 'react';
import { LocationContext } from 'shared/context/Location/LocationContext';

export const LocationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [location, setLocation] = useState<Position>();

  return <LocationContext.Provider value={{ location, setLocation }}>{children}</LocationContext.Provider>;
};
