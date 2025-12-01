import { format } from 'date-fns';
import { Link, generatePath } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import type { JournalArticle } from '../types';
import cls from './JournalArticleCard.module.scss';

interface JournalArticleCardProps {
  article: JournalArticle;
}

const formatPublishedDate = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return format(date, 'MMM d, yyyy');
};

const getCoverImageUrl = (article: JournalArticle) => {
  const formats = article.coverImage?.formats as Record<string, { url: string }> | undefined;

  return article.coverImage?.url ?? formats?.large?.url ?? formats?.medium?.url ?? formats?.small?.url ?? '';
};

export const JournalArticleCard = ({ article }: JournalArticleCardProps) => {
  const coverImageUrl = getCoverImageUrl(article);
  const publishedDateSource: string | null = article.publishedAt ?? article.createdAt ?? null;
  const publishedDate = formatPublishedDate(publishedDateSource);
  const articlePath = generatePath(`/${RoutePaths.journalArticle}`, { slug: article.slug });

  return (
    <Link to={articlePath} className={cls.card}>
      <div className={cls.thumbnail}>
        {coverImageUrl ? (
          <img src={coverImageUrl} alt={article.coverImage?.alternativeText ?? article.title} loading="lazy" />
        ) : (
          <div className={cls.thumbnailPlaceholder} aria-hidden="true">
            <span>Journal</span>
          </div>
        )}
      </div>
      <div className={cls.content}>
        <div className={cls.meta}>
          {publishedDate && <span>{publishedDate}</span>}
          {/* {article.author && <span>{article.author}</span>} */}
        </div>
        <h3>{article.title}</h3>
        {article.description && <p className={cls.description}>{article.description}</p>}
        {article.tags?.length > 0 && (
          <div className={cls.tags} aria-label="Article tags">
            {article.tags.map((tag) => (
              <span key={`${article.documentId}-${tag}`}>{tag}</span>
            ))}
          </div>
        )}
        <p className={cls.readMore} aria-label="Read full article">
          Read story →
        </p>
      </div>
    </Link>
  );
};
