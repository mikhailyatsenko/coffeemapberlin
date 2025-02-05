import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
