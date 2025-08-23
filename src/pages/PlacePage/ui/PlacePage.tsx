import { useParams } from 'react-router-dom';
import { DetailedPlace } from 'widgets/DetailedPlace';

const PlacePage = () => {
  const { id } = useParams<{ id: string }>();
  return <DetailedPlace placeId={id ?? ''} />;
};

export default PlacePage;
