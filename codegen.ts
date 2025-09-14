import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    'http://localhost:3000/coffee': {
      headers: {
        'Content-Type': 'application/json',
        'apollo-require-preflight': 'true',
      },
    },
  },
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    'src/shared/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        namingConvention: 'keep',
      },
    },
  },
};

export default config;
