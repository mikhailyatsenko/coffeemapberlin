import { type ReactNode } from 'react';
import { AboutPage } from 'pages/AboutPage';
import { AccountSettingsPage } from 'pages/AccountSettingsPage';
import { BlogPage } from 'pages/BlogPage';
import { ContactPage } from 'pages/ContactPage';
import { LoginPage } from 'pages/LoginPage';
import { MainPage } from 'pages/MainPage';
import { MyReviews } from 'pages/MyReviews';
import { NotFoundPage } from 'pages/NotFoundPage';
import { DetailedPlaceCard } from 'widgets/DetailedPlaceCard';
import { AppRoutes, RoutePaths } from 'shared/constants';
import { PrivateRoute } from '../../ui/PrivateRoute';

export interface AppRouteConfig {
  path: string;
  element: ReactNode;
  children?: AppRouteConfig[];
}

export const routeConfig: Record<AppRoutes, AppRouteConfig> = {
  [AppRoutes.MAIN]: {
    path: RoutePaths.main,
    element: <MainPage />,
    children: [
      {
        path: 'details',
        element: <DetailedPlaceCard />,
      },
    ],
  },
  [AppRoutes.BLOG]: {
    path: RoutePaths.blog,
    element: <BlogPage />,
  },
  [AppRoutes.ABOUT]: {
    path: RoutePaths.about,
    element: <AboutPage />,
  },
  [AppRoutes.CONTACTS]: {
    path: RoutePaths.contacts,
    element: <ContactPage />,
  },
  [AppRoutes.MY_REVIEWS]: {
    path: RoutePaths.myReviews,
    element: (
      <PrivateRoute>
        <MyReviews />
      </PrivateRoute>
    ),
  },
  [AppRoutes.PROFILE]: {
    path: RoutePaths.profile,
    element: (
      <PrivateRoute>
        <AccountSettingsPage />
      </PrivateRoute>
    ),
  },
  [AppRoutes.LOGIN]: {
    path: RoutePaths.login,
    element: <LoginPage />,
  },
  [AppRoutes.CONFIRM_EMAIL]: {
    path: RoutePaths.confirmEmail,
    element: <MainPage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePaths.not_found,
    element: <NotFoundPage />,
  },
};
