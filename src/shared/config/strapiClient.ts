import { createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://cms.3welle.com/graphql',
  fetchOptions: {
    credentials: 'omit',
  },
});

export const strapiClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
