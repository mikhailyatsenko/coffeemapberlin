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
