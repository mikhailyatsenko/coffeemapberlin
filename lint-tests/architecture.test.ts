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

const messagesByFile = new Map<string, Linter.LintMessage[]>();

beforeAll(async () => {
  const eslint = new ESLint({ cwd: FIXTURES, useEslintrc: false, overrideConfig: fixtureConfig, ignore: false });
  const results = await eslint.lintFiles(['src']);
  for (const result of results) {
    messagesByFile.set(path.relative(FIXTURES, result.filePath), result.messages);
  }
}, 60_000);

const messagesFor = (file: string) => {
  const messages = messagesByFile.get(file);
  if (!messages) throw new Error(`No fixture at ${file}`);
  return messages;
};

// A null rule id is either a parse error or a problem with an eslint-disable comment itself.
const ruleIdOf = (message: Linter.LintMessage) => message.ruleId ?? (message.fatal ? 'fatal' : 'directive');

const ruleIdsFor = (file: string) =>
  messagesFor(file)
    .map(ruleIdOf)
    .sort((a, b) => a.localeCompare(b));

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

describe('slice segments', () => {
  it('rejects an unknown segment in a slice', () => {
    expect(ruleIdsFor('src/features/Search/utils/helper.ts')).toEqual(['no-restricted-syntax']);
  });

  it('allows a known segment in a slice', () => {
    expect(ruleIdsFor('src/features/Search/lib/helper.ts')).toEqual([]);
  });

  it('rejects a root index.tsx', () => {
    expect(ruleIdsFor('src/entities/Review/index.tsx')).toEqual(['no-restricted-syntax']);
  });

  it('allows a root index.ts', () => {
    expect(ruleIdsFor('src/entities/Place/index.ts')).toEqual([]);
  });
});

describe('components/X segments', () => {
  it('rejects an unknown segment in components/X', () => {
    expect(ruleIdsFor('src/features/Search/components/Filter/Filter.ts')).toEqual(['no-restricted-syntax']);
  });

  it('rejects a loose file in components/', () => {
    expect(ruleIdsFor('src/features/Search/components/Loose.ts')).toEqual(['no-restricted-syntax']);
  });

  it('allows an index.ts in components/', () => {
    expect(ruleIdsFor('src/features/Search/components/index.ts')).toEqual([]);
  });

  it('allows a known segment in components/X', () => {
    expect(ruleIdsFor('src/features/Search/components/Filter/ui/FilterView.ts')).toEqual([]);
  });

  it('allows an index.ts in components/X', () => {
    expect(ruleIdsFor('src/features/Search/components/Filter/index.ts')).toEqual([]);
  });

  it('rejects components/ nested in components/, with the nesting message', () => {
    const file = 'src/features/Search/components/Filter/components/Chip/ui/NestedChip.ts';
    expect(ruleIdsFor(file)).toEqual(['no-restricted-syntax']);
    // Both overrides share the rule id, so only the message shows which one won.
    expect(messagesFor(file)[0].message).toMatch(/must not contain a components\/ folder/);
  });

  it('allows a sub-component beside its parent in components/', () => {
    expect(ruleIdsFor('src/features/Search/components/Chip/ui/Chip.ts')).toEqual([]);
  });
});

// Severity per rule id, so a test can tell a `warn` rule from an `error` one.
const ruleIdsWithSeverityFor = (file: string) =>
  messagesFor(file)
    .map((message) => `${ruleIdOf(message)}:${message.severity === 1 ? 'warn' : 'error'}`)
    .sort((a, b) => a.localeCompare(b));

const WHOLE_STORE = 'Whole-store subscription';

describe('whole-store subscriptions', () => {
  it('warns on a store hook called without a selector', () => {
    expect(ruleIdsWithSeverityFor('src/features/Search/ui/wholeStore.ts')).toEqual(['no-restricted-syntax:warn']);
  });

  it('allows a store hook called with a selector', () => {
    expect(ruleIdsFor('src/features/Search/ui/selectorStore.ts')).toEqual([]);
  });

  it("still reports inside a file covered by an error override, at that override's severity", () => {
    const file = 'src/features/Search/utils/wholeStore.ts';
    // Why error, not warn: see globalRestrictedSyntax in .eslintrc.cjs.
    expect(ruleIdsWithSeverityFor(file)).toEqual(['no-restricted-syntax:error', 'no-restricted-syntax:error']);
    // Both findings share the rule id, so only the message shows that the whole-store check fired.
    expect(messagesFor(file).some((message) => message.message.includes(WHOLE_STORE))).toBe(true);
  });

  it('still warns inside a slice root index.ts, whose override is warn', () => {
    const file = 'src/features/Cart/index.ts';
    expect(ruleIdsWithSeverityFor(file)).toEqual(['no-restricted-syntax:warn', 'no-restricted-syntax:warn']);
    expect(messagesFor(file).some((message) => message.message.includes(WHOLE_STORE))).toBe(true);
  });
});

describe('slice root index exports', () => {
  it("warns on a re-export from a segment other than './ui'", () => {
    expect(ruleIdsWithSeverityFor('src/features/Profile/index.ts')).toEqual(['no-restricted-syntax:warn']);
  });

  it("allows a re-export from './ui'", () => {
    expect(ruleIdsFor('src/widgets/Sidebar/index.ts')).toEqual([]);
  });

  it("allows a re-export from './ui/X'", () => {
    expect(ruleIdsFor('src/entities/Place/index.ts')).toEqual([]);
  });
});

describe('data access in presentational layers', () => {
  const RESTRICTED = ['@typescript-eslint/no-restricted-imports:error'];

  it('rejects a store import in shared/ui', () => {
    expect(ruleIdsWithSeverityFor('src/shared/ui/Badge/importsStore.ts')).toEqual(RESTRICTED);
  });

  it('rejects a generated hook in shared/ui, entities/*/ui and entities/*/components', () => {
    expect(ruleIdsWithSeverityFor('src/shared/ui/Badge/importsGeneratedHook.ts')).toEqual(RESTRICTED);
    expect(ruleIdsWithSeverityFor('src/entities/Place/ui/importsGeneratedHook.ts')).toEqual(RESTRICTED);
    expect(ruleIdsWithSeverityFor('src/entities/Place/components/Pin/ui/importsGeneratedHook.ts')).toEqual(RESTRICTED);
  });

  it('rejects a value import from @apollo/client and its subpaths in shared/ui', () => {
    expect(ruleIdsWithSeverityFor('src/shared/ui/Badge/importsApolloValue.ts')).toEqual(RESTRICTED);
    expect(ruleIdsWithSeverityFor('src/shared/ui/Badge/importsApolloSubpath.ts')).toEqual(RESTRICTED);
  });

  it('rejects shared/api in shared/ui', () => {
    expect(ruleIdsWithSeverityFor('src/shared/ui/Badge/importsApi.ts')).toEqual(RESTRICTED);
  });

  it('allows a type-only @apollo/client import in shared/ui', () => {
    expect(ruleIdsFor('src/shared/ui/Badge/importsApolloType.ts')).toEqual([]);
  });

  it('allows a generated type in shared/ui', () => {
    expect(ruleIdsFor('src/shared/ui/Badge/importsGeneratedType.ts')).toEqual([]);
  });

  it("allows a generated hook in a feature's ui/", () => {
    expect(ruleIdsFor('src/features/Search/ui/importsGeneratedHook.ts')).toEqual([]);
  });
});

describe('eslint-disable hygiene', () => {
  const DISABLES = 'src/shared/lib/disables';

  it('rejects a disable without a description', () => {
    expect(ruleIdsWithSeverityFor(`${DISABLES}/withoutDescription.ts`)).toEqual([
      '@eslint-community/eslint-comments/require-description:error',
    ]);
  });

  it('rejects a disable that names no rule', () => {
    expect(ruleIdsWithSeverityFor(`${DISABLES}/unlimited.ts`)).toEqual([
      '@eslint-community/eslint-comments/no-unlimited-disable:error',
    ]);
  });

  it('reports a disable that suppresses nothing', () => {
    // Why warn is enough: see reportUnusedDisableDirectives in .eslintrc.cjs.
    expect(ruleIdsWithSeverityFor(`${DISABLES}/unused.ts`)).toEqual(['directive:warn']);
  });

  it('allows a named, described disable that suppresses a real violation', () => {
    expect(ruleIdsFor(`${DISABLES}/namedAndDescribed.ts`)).toEqual([]);
  });
});
