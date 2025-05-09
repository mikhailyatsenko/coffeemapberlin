import { createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.VITE_ENV === 'development' ? process.env.VITE_API_URL : process.env.VITE_API_URL_PROD,
  credentials: 'include',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
