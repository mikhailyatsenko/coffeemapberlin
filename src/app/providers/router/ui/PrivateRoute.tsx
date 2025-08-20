import { Navigate, useLocation } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { useAuthStore } from 'shared/stores/auth';

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to={RoutePaths.login} state={{ from: location }} replace />;
  }

  return children;
};
