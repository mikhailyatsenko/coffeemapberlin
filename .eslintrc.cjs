const LAYERS = '{pages,widgets,features,entities}';
// components/X is a mini-slice: the slice segments minus its own components/.
const COMPONENT_SEGMENT_NAMES = ['ui', 'types', 'constants', 'lib', 'model', 'api', 'hooks', 'mappers'];
const COMPONENT_SEGMENTS = `{${COMPONENT_SEGMENT_NAMES.join(',')}}`;
const SLICE_SEGMENTS = `{${['components', ...COMPONENT_SEGMENT_NAMES].join(',')}}`;

// Global no-restricted-syntax selectors. An override that sets no-restricted-syntax replaces
// the global options instead of merging them, so every such override spreads these back in.
// Severity is one per rule, so inside an `error` override these report as errors too. That changes
// nothing in practice: such an override flags the whole file, so the file fails lint either way.
const globalRestrictedSyntax = [
  {
    selector: "CallExpression[callee.type='Identifier'][callee.name=/^use[A-Z]\\w*Store$/][arguments.length=0]",
    message:
      'Whole-store subscription re-renders on every store change → pass a selector, e.g. useXStore((s) => s.field), or useShallow for several fields.',
  },
];

// A shared module and everything under it, by alias or by any path that goes through shared/.
const sharedModule = (name) => [`shared/${name}`, `shared/${name}/**`, `**/shared/${name}`, `**/shared/${name}/**`];

// Fires once on any file the override matches: the file's path is the violation.
const restrictPath = (message) => ['error', ...globalRestrictedSyntax, { selector: 'Program', message }];

const APOLLO_MESSAGE =
  'Presentational code must not talk to Apollo → take the data and callbacks via props from a feature or page, or use `import type` for Apollo types.';

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    '@feature-sliced/eslint-config/rules/import-order',
  ],
  overrides: [
    {
      files: ['api/**/*.js'],
      parserOptions: { project: null },
      env: { node: true },
    },
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['src/shared/generated/**/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'prefer-const': 'off',
      },
    },
    // Presentational layers get data only through props. Types stay importable.
    {
      files: ['src/shared/ui/**', 'src/entities/*/ui/**', 'src/entities/*/components/**'],
      rules: {
        '@typescript-eslint/no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@apollo/client',
                allowTypeImports: true,
                message: APOLLO_MESSAGE,
              },
            ],
            patterns: [
              { group: ['@apollo/client/*'], allowTypeImports: true, message: APOLLO_MESSAGE },
              {
                group: sharedModule('stores'),
                message:
                  'Presentational code must not read or write stores → take the state and callbacks via props from a feature or page.',
              },
              {
                group: sharedModule('generated/graphql'),
                importNamePattern: '^use',
                message:
                  "Generated Apollo hooks fetch data, which presentational code must not do → call the hook in a feature's or page's ui/ and pass the result via props; generated types stay importable.",
              },
              {
                group: [...sharedModule('config/apolloClient'), ...sharedModule('query'), ...sharedModule('api')],
                message:
                  'Presentational code must not use the Apollo client, queries or API wrappers → do the data access in a feature or page and pass the result via props.',
              },
            ],
          },
        ],
      },
    },
    {
      files: [`src/${LAYERS}/*/**`],
      excludedFiles: [`src/${LAYERS}/*/index.ts`, `src/${LAYERS}/*/${SLICE_SEGMENTS}/**`, 'src/entities/*/@x/*.ts'],
      rules: {
        'no-restricted-syntax': restrictPath(
          `A slice holds only the segments ${SLICE_SEGMENTS} and a root index.ts → move this file into the segment that fits its purpose (e.g. utils/ → lib/), or rename index.tsx to index.ts.`,
        ),
      },
    },
    {
      files: [`src/${LAYERS}/*/components/**`],
      excludedFiles: [
        `src/${LAYERS}/*/components/index.ts`,
        `src/${LAYERS}/*/components/*/index.ts`,
        `src/${LAYERS}/*/components/*/${COMPONENT_SEGMENTS}/**`,
      ],
      rules: {
        'no-restricted-syntax': restrictPath(
          `components/ holds only an index.ts and folders X/, and components/X holds only an index.ts and the segments ${COMPONENT_SEGMENTS} → move this file into the segment of components/X that fits its purpose (a component goes into ui/).`,
        ),
      },
    },
    // Comes after the components/X override: later overrides win, so this message replaces that one.
    {
      files: [`src/${LAYERS}/*/components/**/components/**`],
      rules: {
        'no-restricted-syntax': restrictPath(
          "components/X must not contain a components/ folder → move the sub-component beside its parent, into the slice's own components/.",
        ),
      },
    },
    // Only index.ts: a root index.tsx is already rejected by the segment override above.
    {
      files: [`src/${LAYERS}/*/index.ts`],
      rules: {
        'no-restricted-syntax': [
          'warn',
          ...globalRestrictedSyntax,
          {
            // esquery regexes cannot contain a literal `/`, hence \x2F.
            selector:
              ':matches(ExportAllDeclaration, ExportNamedDeclaration)[source.value!=/^\\.\\x2Fui(\\x2F|$)/], ExportNamedDeclaration[source=null], ExportDefaultDeclaration',
            message:
              "A slice root index.ts exposes only the ui segment → re-export from './ui', e.g. export { X } from './ui/X', and keep model, lib, types etc. private or move what others need into ui.",
          },
        ],
      },
    },
    {
      files: ['vite.config.ts'],
      parserOptions: {
        project: ['./tsconfig.node.json'],
      },
      env: {
        node: true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'boundaries'],
  rules: {
    'no-restricted-syntax': ['warn', ...globalRestrictedSyntax],
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        message:
          '${file.type} must not import ${dependency.type}: a layer imports only the layers below it, and slices on one layer never import each other → move the shared code down to a lower layer, or compose both slices in the layer above.',
        rules: [
          { from: 'app', allow: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] },
          { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
          { from: 'widgets', allow: ['features', 'entities', 'shared'] },
          { from: 'features', allow: ['entities', 'shared'] },
          // entities/A/@x/B.ts is the API of entity A for entity B only.
          { from: 'entities', allow: ['shared', ['entities-x', { consumer: '${from.slice}' }]] },
          { from: 'entities-x', allow: ['shared', ['entities', { slice: '${from.host}' }]] },
          { from: 'shared', allow: ['shared'] },
        ],
      },
    ],
    'boundaries/entry-point': [
      'error',
      {
        default: 'disallow',
        message:
          "'${dependency.internalPath}' is inside another slice → import from the slice root ('${dependency.type}/${dependency.slice}'), exporting what you need from its index.ts; entities may also expose '@x/<consumer>.ts' to another entity.",
        rules: [
          { target: ['pages', 'widgets', 'features', 'entities'], allow: 'index.(ts|tsx)' },
          // An @x file re-exports from its own entity.
          { target: ['entities'], allow: [['**', { slice: '${from.host}' }]] },
          { target: ['entities-x', 'app', 'shared'], allow: '**' },
        ],
      },
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        enums: 'always-multiline',
        generics: 'always-multiline',
        tuples: 'always-multiline',
      },
    ],
    'prefer-const': 'warn',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app' },
      { type: 'pages', pattern: 'src/pages/*', capture: ['slice'] },
      { type: 'widgets', pattern: 'src/widgets/*', capture: ['slice'] },
      { type: 'features', pattern: 'src/features/*', capture: ['slice'] },
      { type: 'entities-x', pattern: 'src/entities/*/@x/*.ts', mode: 'file', capture: ['host', 'consumer'] },
      { type: 'entities', pattern: 'src/entities/*', capture: ['slice'] },
      { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
    ],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
