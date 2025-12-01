import { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { strapiClient } from 'shared/config/strapiClient';
import { RoutePaths } from 'shared/constants';
import { useGetArticleQuery, useGetArticlesQuery } from 'shared/generated/graphql';
import cls from './JournalArticlePage.module.scss';

const getCoverImageUrl = (formats: unknown, fallback?: string | null) => {
  if (fallback) {
    return fallback;
  }

  const typedFormats = formats as Record<string, { url: string }> | undefined;

  return typedFormats?.large?.url ?? typedFormats?.medium?.url ?? typedFormats?.small?.url ?? '';
};

export const JournalArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: listData,
    loading: isListLoading,
    error: listError,
  } = useGetArticlesQuery({
    client: strapiClient,
  });

  const baseArticle = useMemo(
    () => listData?.articles.find((article) => article.slug === slug),
    [listData?.articles, slug],
  );

  const {
    data: detailedArticleData,
    loading: isDetailedLoading,
    error: detailedError,
  } = useGetArticleQuery({
    client: strapiClient,
    variables: { documentId: baseArticle?.documentId ?? '' },
    skip: !baseArticle?.documentId,
  });

  const article = detailedArticleData?.article ?? baseArticle;

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | Journal | Berlin Coffee Map`;
    }
  }, [article?.title]);

  if (!slug) {
    return (
      <main className={`${cls.JournalArticlePage} container`}>
        <p className={cls.state}>Missing article slug.</p>
      </main>
    );
  }

  if (isListLoading) {
    return (
      <main className={`${cls.JournalArticlePage} container`}>
        <p className={cls.state}>Brewing your article...</p>
      </main>
    );
  }

  if (listError) {
    return (
      <main className={`${cls.JournalArticlePage} container`}>
        <p className={cls.state} role="alert">
          We couldn&apos;t open this journal entry. Please try again later.
        </p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className={`${cls.JournalArticlePage} container`}>
        <p className={cls.state}>We couldn&apos;t find this article.</p>
      </main>
    );
  }

  if (detailedError) {
    return (
      <main className={`${cls.JournalArticlePage} container`}>
        <p className={cls.state} role="alert">
          Something went wrong while loading the article content.
        </p>
      </main>
    );
  }

  const coverUrl = getCoverImageUrl(article.coverImage?.formats, article.coverImage?.url);
  const publishedDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : undefined;

  return (
    <main className={`${cls.JournalArticlePage} container`}>
      <Link to={`/${RoutePaths.journal}`} className={cls.breadcrumb}>
        ← Back to Journal
      </Link>

      <section className={cls.hero}>
        <p className={cls.meta}>
          {publishedDate && <span>{publishedDate}</span>}
          {/* {article.author && <span>By {article.author}</span>} */}
        </p>
        <h1 className={cls.heroTitle}>{article.title}</h1>

        {article.tags?.length ? (
          <div className={cls.meta} aria-label="Article tags">
            {article.tags.map((tag) => (
              <span key={`${article.documentId}-${tag}`}>#{tag}</span>
            ))}
          </div>
        ) : null}
      </section>

      {coverUrl && (
        <div className={cls.cover}>
          <img src={coverUrl} alt={article.coverImage?.alternativeText ?? article.title} />
        </div>
      )}

      {isDetailedLoading ? (
        <p className={cls.state}>Pouring the full story...</p>
      ) : (
        <article className={cls.content}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content ?? ''}</ReactMarkdown>
        </article>
      )}
    </main>
  );
};
