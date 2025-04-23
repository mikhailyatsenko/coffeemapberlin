import { useContext } from 'react';
import { PlacesDataContext } from './PlacesContext';

export const usePlaces = () => {
  const context = useContext(PlacesDataContext);
  if (context === undefined) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
};
