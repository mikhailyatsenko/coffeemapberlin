import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation, matchPath } from 'react-router-dom';
import { Footer } from 'widgets/Footer';
import { Navbar } from 'widgets/Navbar';
import { RoutePaths } from 'shared/constants';
import { checkAuth } from 'shared/stores/auth';

import { AppRouter } from './providers/router';

const App = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  if (!GOOGLE_CLIENT_ID) {
    throw new Error(`Missing required environment variable: GOOGLE_CLIENT_ID`);
  }
  const location = useLocation();

  useEffect(() => {
    void checkAuth();
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
