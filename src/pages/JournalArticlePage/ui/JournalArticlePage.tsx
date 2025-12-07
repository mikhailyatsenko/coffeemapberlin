import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { strapiClient } from 'shared/config/strapiClient';
import { RoutePaths } from 'shared/constants';
import { useGetArticleQuery } from 'shared/generated/graphql';
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

  useEffect(() => {
    if (article?.seo) {
      // Update title
      if (article.seo.metaTitle) {
        document.title = article.seo.metaTitle;
      } else if (article.title) {
        document.title = `${article.title} | Journal | Berlin Coffee Map`;
      }

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && article.seo.metaDescription) {
        metaDescription.setAttribute('content', article?.seo.metaDescription);
      }

      // Update canonical URL
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink && article.seo.canonicalURL) {
        canonicalLink.setAttribute('href', article.seo.canonicalURL);
      }

      // Update Open Graph image
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && article.seo.metaImage?.url) {
        ogImage.setAttribute('content', article.seo.metaImage.url);
      }

      // Update Open Graph title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && article.seo.metaTitle) {
        ogTitle.setAttribute('content', article.seo.metaTitle);
      }

      // Update Open Graph description
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription && article.seo.metaDescription) {
        ogDescription.setAttribute('content', article.seo.metaDescription);
      }
    } else if (article?.title) {
      // Fallback to basic title update if no SEO data
      document.title = `${article.title} | Journal | Berlin Coffee Map`;
    }
  }, [article?.title, article?.seo]);

  if (!slug) {
    return (
      <main className={`container`}>
        <p className={cls.state}>Missing article slug.</p>
      </main>
    );
  }

  if (isArticleLoading) {
    return (
      <main className={`container`}>
        <p className={cls.state}>Brewing your article...</p>
      </main>
    );
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
