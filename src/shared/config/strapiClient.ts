import { createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://cms.yatsenko.site/graphql',
  fetchOptions: {
    credentials: 'omit',
  },
});

export const strapiClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
