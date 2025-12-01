import type { GetArticlesQuery } from 'shared/generated/graphql';

export type JournalArticle = GetArticlesQuery['articles'][number];
