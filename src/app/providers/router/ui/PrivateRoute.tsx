import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { useAuthStore } from 'shared/stores/auth';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = async ({ children }: PrivateRouteProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/${RoutePaths.login}`} state={{ from: location }} replace />;
  }

  return await children;
};
