import React from 'react';
import cls from './JournalArticleSkeleton.module.scss';

export const JournalArticleSkeleton: React.FC = () => {
  return (
    <main className={`container`}>
      <div className={`${cls.shimmer} ${cls.breadcrumb}`} />

      <section className={cls.hero}>
        <div className={`${cls.shimmer} ${cls.meta}`} />
        <div className={`${cls.shimmer} ${cls.heroTitle}`} />
      </section>

      <div className={cls.cover}>
        <div className={`${cls.shimmer} ${cls.coverImage}`} />
      </div>

      <article className={cls.content}>
        {/* Introduction paragraph */}
        <div className={`${cls.shimmer} ${cls.paragraph} ${cls.paragraphLong}`} />

        {/* Heading */}
        <div className={`${cls.shimmer} ${cls.heading2}`} />

        {/* Content paragraphs */}
        <div className={`${cls.shimmer} ${cls.paragraph}`} />
        <div className={`${cls.shimmer} ${cls.paragraph} ${cls.paragraphMedium}`} />
        <div className={`${cls.shimmer} ${cls.paragraph} ${cls.paragraphShort}`} />

        {/* Image in content */}
        <div className={`${cls.shimmer} ${cls.contentImage}`} />

        {/* Another heading */}
        <div className={`${cls.shimmer} ${cls.heading3}`} />

        {/* More paragraphs */}
        <div className={`${cls.shimmer} ${cls.paragraph} ${cls.paragraphLong}`} />
        <div className={`${cls.shimmer} ${cls.paragraph}`} />
        <div className={`${cls.shimmer} ${cls.paragraph} ${cls.paragraphMedium}`} />

        {/* List */}
        <div className={cls.list}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`${cls.shimmer} ${cls.listItem}`} />
          ))}
        </div>

        {/* Final paragraph */}
        <div className={`${cls.shimmer} ${cls.paragraph} ${cls.paragraphLong}`} />
      </article>
    </main>
  );
};
