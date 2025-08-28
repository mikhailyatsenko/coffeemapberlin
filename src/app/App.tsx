import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation, matchPath } from 'react-router-dom';
import { Footer } from 'widgets/Footer';
import { Navbar } from 'widgets/Navbar';
import { RoutePaths } from 'shared/constants';
import { useGetPlacesQuery, useGetPlacesLazyQuery } from 'shared/generated/graphql';
import { checkAuth, useAuthStore } from 'shared/stores/auth';
import { setPlaces, setLoadingState, usePlacesStore, PAGE_SIZE, INITIAL_OFFSET } from 'shared/stores/places';
import { Loader } from 'shared/ui/Loader';
import { AppRouter } from './providers/router';

const App = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  if (!GOOGLE_CLIENT_ID) {
    throw new Error(`Missing required environment variable: GOOGLE_CLIENT_ID`);
  }
  const location = useLocation();
  const { isAuthLoading } = useAuthStore();

  const { data: initialData, loading: initialLoading } = useGetPlacesQuery({
    variables: { limit: PAGE_SIZE, offset: INITIAL_OFFSET },
    fetchPolicy: 'cache-first',
  });

  const [fetchMore, { loading: moreDataLoading }] = useGetPlacesLazyQuery();

  useEffect(() => {
    const state = usePlacesStore.getState();

    if (state.fetchMoreInProgress) {
      console.log('fetchMore already in progress, skipping');
      return;
    }

    if (!initialData?.places || state.isInitialLoadComplete) return;

    const initialPlaces = initialData.places.places ?? [];
    setPlaces(initialPlaces);
    setLoadingState({ isInitialLoadComplete: true });

    const totalPlaces = initialData.places.total;
    if (totalPlaces > PAGE_SIZE && !state.fetchMoreInProgress) {
      setLoadingState({ fetchMoreInProgress: true });

      console.log('Starting fetchMore for additional places...');

      fetchMore({
        variables: {
          limit: totalPlaces - PAGE_SIZE,
          offset: PAGE_SIZE,
        },
      })
        .then((result) => {
          if (result.data?.places?.places?.length) {
            const additionalPlaces = result.data.places.places;
            console.log('fetchMore completed, adding', additionalPlaces.length, 'additional places');

            setPlaces((prev) => {
              if (prev.length > PAGE_SIZE) {
                console.log('Places already added, skipping duplicate');
                return prev;
              }

              console.log('Previous places count:', prev.length, 'Adding:', additionalPlaces.length);
              return [...prev, ...additionalPlaces];
            });

            setLoadingState({
              isMoreDataLoaded: true,
              fetchMoreInProgress: false,
            });
          } else {
            setLoadingState({ fetchMoreInProgress: false });
          }
        })
        .catch((error) => {
          console.error('fetchMore failed:', error);
          setLoadingState({ fetchMoreInProgress: false });
        });
    }
  }, [initialData?.places, fetchMore]);

  // Обновляем состояние загрузки в сторе
  useEffect(() => {
    setLoadingState({
      isInitialLoading: initialLoading,
      isMoreDataLoading: moreDataLoading,
    });
  }, [initialLoading, moreDataLoading]);

  useEffect(() => {
    void checkAuth();
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {isAuthLoading ? <Loader /> : null}
      <Navbar />
      <main>
        <AppRouter />
      </main>
      {!matchPath(RoutePaths.main, location.pathname) && <Footer />}
      <Toaster position="bottom-center" />
    </GoogleOAuthProvider>
  );
};

export default App;
