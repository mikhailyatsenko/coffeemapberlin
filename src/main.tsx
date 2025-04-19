import './index.scss';
import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'app/providers/AuthProvider';
import { LocationProvider } from 'app/providers/LocationProvider';
import { PlacesDataProvider } from 'app/providers/PlacesDataProvider';
import { client } from 'shared/config/apolloClient';
import App from './app/App';

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error(`Missing required environment variable: GOOGLE_CLIENT_ID`);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <LocationProvider>
            <PlacesDataProvider>
              <App />
            </PlacesDataProvider>
          </LocationProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  </ApolloProvider>,
);
