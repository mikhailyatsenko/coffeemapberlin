import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { strapiClient } from 'shared/config/strapiClient';
import { RoutePaths } from 'shared/constants';
import { useGetArticleQuery } from 'shared/generated/graphql';
import { JournalArticleSkeleton } from '../components';
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
    data: detailedArticleData,
    loading: isArticleLoading,
    error: articleError,
  } = useGetArticleQuery({
    client: strapiClient,
    variables: { slug: slug ?? '' },
    skip: !slug,
  });

  const article = detailedArticleData?.articles?.[0] ?? null;

  if (!slug) {
    return (
      <main className={`container`}>
        <p className={cls.state}>Missing article slug.</p>
      </main>
    );
  }

  if (isArticleLoading) {
    return <JournalArticleSkeleton />;
  }

  if (articleError) {
    return (
      <main className={`container`}>
        <p className={cls.state} role="alert">
          We couldn&apos;t open this journal entry. Please try again later.
        </p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className={`container`}>
        <p className={cls.state}>We couldn&apos;t find this article.</p>
      </main>
    );
  }

  const coverUrl = getCoverImageUrl(article.coverImage?.formats, article?.coverImage?.url);
  const publishedDate = article.publishedAt ? new Date(article.publishedAt as string).toLocaleDateString() : undefined;

  return (
    <main className={`container`}>
      <Helmet>
        <title>{article.seo?.metaTitle ?? `${article.title} | Journal | Berlin Coffee Map`}</title>
        {article.seo?.metaDescription && <meta name="description" content={article.seo.metaDescription} />}
        {article.seo?.canonicalURL && <link rel="canonical" href={article.seo.canonicalURL} />}
        {article.seo?.metaImage?.url && <meta property="og:image" content={article.seo.metaImage.url} />}
        {article.seo?.metaTitle && <meta property="og:title" content={article.seo.metaTitle} />}
        {article.seo?.metaDescription && <meta property="og:description" content={article.seo.metaDescription} />}
      </Helmet>

      <Link to={`/${RoutePaths.journal}`} className={cls.breadcrumb}>
        ← Back to Journal
      </Link>

      <section className={cls.hero}>
        <p className={cls.meta}>
          {publishedDate && <span>{publishedDate}</span>}
          {/* {article.author && <span>By {article.author}</span>} */}
        </p>
        <h1 className={cls.heroTitle}>{article.title}</h1>

        {/* {article.tags?.length ? (
          <div className={cls.meta} aria-label="Article tags">
            {article.tags.map((tag) => (
              <span key={`${article.documentId}-${tag}`}>#{tag}</span>
            ))}
          </div>
        ) : null} */}
      </section>

      {coverUrl && (
        <div className={cls.cover}>
          <img src={coverUrl} alt={article.coverImage?.alternativeText ?? article.title} />
        </div>
      )}

      {isArticleLoading ? (
        <p className={cls.state}>Pouring the full story...</p>
      ) : (
        <article className={cls.content}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article?.content ?? ''}</ReactMarkdown>
        </article>
      )}
    </main>
  );
};
