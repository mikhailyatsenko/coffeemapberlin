import React from 'react';
import cls from './JournalSkeleton.module.scss';

export const JournalSkeleton: React.FC = () => {
  return (
    <main className={`${cls.JournalPage} container`}>
      <section className={cls.hero}>
        <div className={`${cls.shimmer} ${cls.kicker}`} />
      </section>

      <div className={cls.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={cls.card}>
            <div className={cls.thumbnail}>
              <div className={`${cls.shimmer} ${cls.thumbnailPlaceholder}`} />
            </div>
            <div className={cls.content}>
              <div className={`${cls.shimmer} ${cls.meta}`} />
              <div className={`${cls.shimmer} ${cls.title}`} />
              <div className={`${cls.shimmer} ${cls.description}`} />
              <div className={cls.tags}>
                {Array.from({ length: 3 }).map((_, tagIndex) => (
                  <div key={tagIndex} className={`${cls.shimmer} ${cls.tag}`} />
                ))}
              </div>
              <div className={`${cls.shimmer} ${cls.readMore}`} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
