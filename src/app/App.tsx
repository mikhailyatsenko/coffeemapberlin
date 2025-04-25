import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useLocation, matchPath } from 'react-router-dom';
import { AuthProvider } from 'app/providers/AuthProvider';
import { LocationProvider } from 'app/providers/LocationProvider';
import { PlacesDataProvider } from 'app/providers/PlacesDataProvider';
import { Footer } from 'widgets/Footer';
import { Navbar } from 'widgets/Navbar';
import { client } from 'shared/config/apolloClient';
import { AuthModalProvider } from 'shared/context/Auth/AuthModalContext';
import { AppRouter } from './providers/router';
import { AppRoutes } from './providers/router/lib/routeConfig/routeConfig';

const App = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  if (!GOOGLE_CLIENT_ID) {
    throw new Error(`Missing required environment variable: GOOGLE_CLIENT_ID`);
  }
  const location = useLocation();
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <LocationProvider>
            <PlacesDataProvider>
              <AuthModalProvider>
                <Navbar />
                <main>
                  <AppRouter />
                </main>
                {!matchPath(AppRoutes.MAIN, location.pathname) && <Footer />}
              </AuthModalProvider>
            </PlacesDataProvider>
          </LocationProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
