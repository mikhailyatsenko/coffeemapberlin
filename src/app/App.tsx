import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Footer } from 'widgets/Footer';
import { Navbar } from 'widgets/Navbar';
import { client } from 'shared/config/apolloClient';
import { checkAuth } from 'shared/stores/auth';
import { Loader } from 'shared/ui/Loader';
import { EmailConfirmationHandler } from 'shared/utils';
import { AppRouter } from './providers/router';
import { RoutePaths } from './providers/router/lib/routeConfig/routeConfig';

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
        {isLoading ? <Loader /> : null}
        <Navbar />
        <main>
          <AppRouter />
        </main>
        {!matchPath(RoutePaths.main, location.pathname) && <Footer />}
        <EmailConfirmationHandler />
      </GoogleOAuthProvider>
    </ApolloProvider>
  );
};

export default App;
