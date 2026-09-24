// @vitest-environment node
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint, type Linter } from 'eslint';
import { beforeAll, describe, expect, it } from 'vitest';

// Drives the real .eslintrc.cjs against fixtures whose tree mirrors src/.
// The fixtures dir is the ESLint cwd, so `files` globs like `src/pages/**` match them.
const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const FIXTURES_TSCONFIG = path.join(FIXTURES, 'tsconfig.json');

const config: Linter.Config = createRequire(import.meta.url)('../.eslintrc.cjs');

// Only the TS project changes: the fixtures have their own tsconfig, so they stay out of the app typecheck.
const fixtureConfig: Linter.Config = {
  ...config,
  parserOptions: { ...config.parserOptions, project: FIXTURES_TSCONFIG, tsconfigRootDir: FIXTURES },
  settings: {
    ...config.settings,
    'import/resolver': {
      typescript: { ...config.settings?.['import/resolver']?.typescript, project: FIXTURES_TSCONFIG },
    },
  },
};

const ruleIdsByFile = new Map<string, string[]>();

beforeAll(async () => {
  const eslint = new ESLint({ cwd: FIXTURES, useEslintrc: false, overrideConfig: fixtureConfig, ignore: false });
  const results = await eslint.lintFiles(['src']);
  for (const result of results) {
    const ruleIds = result.messages.map((message) => message.ruleId ?? 'fatal').sort((a, b) => a.localeCompare(b));
    ruleIdsByFile.set(path.relative(FIXTURES, result.filePath), ruleIds);
  }
}, 60_000);

const ruleIdsFor = (file: string) => {
  const ruleIds = ruleIdsByFile.get(file);
  if (!ruleIds) throw new Error(`No fixture at ${file}`);
  return ruleIds;
};

describe('layer order', () => {
  it('rejects an import from a higher layer', () => {
    expect(ruleIdsFor('src/entities/User/ui/importsFeature.ts')).toEqual(['boundaries/element-types']);
  });

  it('allows an import from a lower layer', () => {
    expect(ruleIdsFor('src/features/Search/ui/importsEntity.ts')).toEqual([]);
  });
});

describe('slices on one layer', () => {
  it('rejects an import from another slice on the same layer', () => {
    expect(ruleIdsFor('src/widgets/Header/ui/importsWidget.ts')).toEqual(['boundaries/element-types']);
    expect(ruleIdsFor('src/entities/User/ui/importsEntity.ts')).toEqual(['boundaries/element-types']);
  });

  it('allows an import inside the own slice, even by absolute path', () => {
    expect(ruleIdsFor('src/widgets/Header/ui/importsOwnSlice.ts')).toEqual([]);
  });
});

describe('slice public API', () => {
  it('rejects a deep import into another slice', () => {
    expect(ruleIdsFor('src/widgets/Header/ui/importsFeatureDeep.ts')).toEqual(['boundaries/entry-point']);
  });

  it('allows an import from the slice root', () => {
    expect(ruleIdsFor('src/widgets/Header/ui/importsFeatureRoot.ts')).toEqual([]);
  });

  it('allows a deep import into shared', () => {
    expect(ruleIdsFor('src/widgets/Header/ui/importsSharedDeep.ts')).toEqual([]);
  });
});

describe('@x cross-imports', () => {
  it('allows an entity to import another entity through @x/<its name>.ts', () => {
    expect(ruleIdsFor('src/entities/User/ui/importsEntityX.ts')).toEqual([]);
  });

  it('keeps the @x exception from opening deep imports between entities', () => {
    expect(ruleIdsFor('src/entities/User/ui/importsEntityDeep.ts')).toEqual([
      'boundaries/element-types',
      'boundaries/entry-point',
    ]);
  });

  it('allows an @x file to re-export from its own entity', () => {
    expect(ruleIdsFor('src/entities/Place/@x/User.ts')).toEqual([]);
  });

  it('rejects an entity importing @x meant for another entity', () => {
    expect(ruleIdsFor('src/entities/Review/ui/importsEntityXForOther.ts')).toEqual(['boundaries/element-types']);
  });

  it('rejects @x from a layer other than entities', () => {
    expect(ruleIdsFor('src/widgets/Header/ui/importsEntityX.ts')).toEqual(['boundaries/element-types']);
  });

  it('rejects @x on features', () => {
    expect(ruleIdsFor('src/widgets/Header/ui/importsFeatureX.ts')).toEqual(['boundaries/entry-point']);
  });
});
