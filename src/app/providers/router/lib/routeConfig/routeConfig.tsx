import { type ReactNode } from 'react';
import { AboutPage } from 'pages/AboutPage';
import { AccountSettingsPage } from 'pages/AccountSettingsPage';
import { ConfirmEmailPage } from 'pages/ConfirmEmailPage';
import { ContactPage } from 'pages/ContactPage';
import { DisclaimerPage } from 'pages/DisclaimerPage';
import { LoginPage } from 'pages/LoginPage';
import { MainPage } from 'pages/MainPage';
import { MyReviews } from 'pages/MyReviews';
import { NotFoundPage } from 'pages/NotFoundPage';
import { PlacePage } from 'pages/PlacePage';
import { PrivacyPolicyPage } from 'pages/PrivacyPolicyPage';
import { AppRoutes, RoutePaths } from 'shared/constants';
import { PrivateRoute } from '../../ui/PrivateRoute';

export interface AppRouteConfig {
  path: string;
  element: ReactNode;
  children?: AppRouteConfig[];
}

export const routeConfig: Partial<Record<AppRoutes, AppRouteConfig>> = {
  [AppRoutes.MAIN]: {
    path: RoutePaths.main,
    element: <MainPage />,
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
    element: <ConfirmEmailPage />,
  },
  [AppRoutes.PRIVACY]: {
    path: RoutePaths.privacy,
    element: <PrivacyPolicyPage />,
  },
  [AppRoutes.DISCLAIMER]: {
    path: RoutePaths.disclaimer,
    element: <DisclaimerPage />,
  },
  [AppRoutes.PLACE_DETAILS]: {
    path: RoutePaths.placePage,
    element: <PlacePage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePaths.not_found,
    element: <NotFoundPage />,
  },
};
