import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation, matchPath } from 'react-router-dom';
import { Footer } from 'widgets/Footer';
import { Navbar } from 'widgets/Navbar';
import { client } from 'shared/config/apolloClient';
import { RoutePaths } from 'shared/constants';
import { checkAuth, useAuthStore } from 'shared/stores/auth';
import { Loader } from 'shared/ui/Loader';
import { AppRouter } from './providers/router';
const App = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  if (!GOOGLE_CLIENT_ID) {
    throw new Error(`Missing required environment variable: GOOGLE_CLIENT_ID`);
  }
  const location = useLocation();
  const { isAuthLoading } = useAuthStore();

  useEffect(() => {
    void checkAuth();
  }, []);

  return (
    <ApolloProvider client={client}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {isAuthLoading ? <Loader /> : null}
        <Navbar />
        <main>
          <AppRouter />
        </main>
        {!matchPath(RoutePaths.main, location.pathname) && <Footer />}
        <Toaster position="bottom-center" />
      </GoogleOAuthProvider>
    </ApolloProvider>
  );
};

export default App;
