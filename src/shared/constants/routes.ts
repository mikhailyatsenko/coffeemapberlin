export enum AppRoutes {
  MAIN = 'main',
  BLOG = 'blog',
  ABOUT = 'about',
  CONTACTS = 'contacts',
  PROFILE = 'profile',
  MY_REVIEWS = 'myReviews',
  LOGIN = 'login',
  CONFIRM_EMAIL = 'confirmEmail',
  NOT_FOUND = 'not_found',
}

export const RoutePaths: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: '/',
  [AppRoutes.BLOG]: 'blog',
  [AppRoutes.ABOUT]: 'about',
  [AppRoutes.CONTACTS]: 'contacts',
  [AppRoutes.MY_REVIEWS]: 'my-reviews',
  [AppRoutes.PROFILE]: 'profile',
  [AppRoutes.LOGIN]: 'login',
  [AppRoutes.CONFIRM_EMAIL]: 'confirm-email',
  [AppRoutes.NOT_FOUND]: '*',
};
