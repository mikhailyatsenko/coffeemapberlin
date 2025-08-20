import { useParams } from 'react-router-dom';
import { NewDetailedPlaceCard } from 'widgets/NewDetailedPlaceCard';

export const PlacePage = () => {
  const { id } = useParams<{ id: string }>();
  return <NewDetailedPlaceCard placeId={id ?? ''} />;
};
