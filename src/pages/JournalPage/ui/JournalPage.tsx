import { useEffect } from 'react';
import { JournalArticleCard } from 'entities/JournalArticle';
import { strapiClient } from 'shared/config/strapiClient';
import { useGetArticlesQuery } from 'shared/generated/graphql';
import cls from './JournalPage.module.scss';

export const JournalPage = () => {
  const { data, loading, error } = useGetArticlesQuery({
    client: strapiClient,
  });

  useEffect(() => {
    document.title = 'Journal | Berlin Coffee Map';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Stories, insights, brewing tips, café discoveries, and everything related to the world of coffee.',
      );
    }
  }, []);

  const articles = data?.articles ?? [];

  const renderContent = () => {
    if (loading) {
      return (
        <p className={cls.state} aria-live="polite">
          Loading fresh stories...
        </p>
      );
    }

    if (error) {
      return (
        <p className={cls.state} role="alert">
          We couldn&apos;t load the journal right now. Please try again in a moment.
        </p>
      );
    }

    if (articles.length === 0) {
      return <p className={cls.state}>Journal entries will appear here soon.</p>;
    }

    return (
      <div className={cls.grid}>
        {articles.map((article) => (
          <JournalArticleCard key={article.documentId} article={article} />
        ))}
      </div>
    );
  };

  return (
    <main className={`${cls.JournalPage} container`}>
      <section className={cls.hero}>
        <h1 className={cls.kicker}>Journal</h1>
        {/* <h1>Stories from Berlin&apos;s specialty coffee scene</h1>
        <p className={cls.subtitle}>
          Brew guides, neighborhood walk-throughs, interviews with baristas, and everything else we learn while
          exploring the city cup by cup.
        </p> */}
      </section>

      {renderContent()}
    </main>
  );
};
