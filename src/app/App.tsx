import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { LocationProvider } from 'app/providers/LocationProvider';
import { PlacesDataProvider } from 'app/providers/PlacesDataProvider';
import { Footer } from 'widgets/Footer';
import { Navbar } from 'widgets/Navbar';
import { client } from 'shared/config/apolloClient';
import { AuthModalProvider } from 'shared/context/Auth/AuthModalContext';
import { checkAuth } from 'shared/stores/auth';
import { Loader } from 'shared/ui/Loader';
import { AppRouter } from './providers/router';
import { AppRoutes } from './providers/router/lib/routeConfig/routeConfig';

const App = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  if (!GOOGLE_CLIENT_ID) {
    throw new Error(`Missing required environment variable: GOOGLE_CLIENT_ID`);
  }
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    void checkAuth().finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <LocationProvider>
          <PlacesDataProvider>
            {isLoading ? <Loader /> : null}
            <Navbar />
            <main>
              <AppRouter />
            </main>
            {!matchPath(AppRoutes.MAIN, location.pathname) && <Footer />}
          </PlacesDataProvider>
        </LocationProvider>
      </GoogleOAuthProvider>
    </ApolloProvider>
  );
};

export default App;
