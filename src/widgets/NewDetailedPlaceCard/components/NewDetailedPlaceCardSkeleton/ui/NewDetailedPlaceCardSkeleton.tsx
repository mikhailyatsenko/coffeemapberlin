import React from 'react';
import cls from './NewDetailedPlaceCardSkeleton.module.scss';

export const NewDetailedPlaceCardSkeleton: React.FC = () => {
  return (
    <div className={cls.skeletonPage}>
      <header className={cls.skeletonHeader}>
        <div className={cls.briefInfo}>
          <div className={`${cls.skeletonBlock}`}>
            <div className={`${cls.shimmer} ${cls.title}`} />
            <div className={cls.badges}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${cls.shimmer} ${cls.badge}`} />
              ))}
            </div>
            <div className={`${cls.shimmer} ${cls.description}`} />
            <div className={cls.actions}>
              <div className={`${cls.shimmer} ${cls.button}`} />
              <div className={`${cls.shimmer} ${cls.button}`} />
            </div>
          </div>
        </div>
        <div className={cls.headerImg}>
          <div className={`${cls.shimmer} ${cls.squareImage}`} />
        </div>
      </header>
      <div className={cls.layout}>
        <main className={cls.main}>
          <div className={cls.skeletonBlock}>
            <div className={`${cls.shimmer} ${cls.row}`} style={{ width: '30%' }} />
            <div className={`${cls.shimmer} ${cls.row}`} style={{ marginTop: 12 }} />
            <div className={`${cls.shimmer} ${cls.row}`} style={{ marginTop: 8, width: '80%' }} />
            <div className={`${cls.shimmer} ${cls.row}`} style={{ marginTop: 8, width: '60%' }} />
          </div>
        </main>
        <aside className={cls.sidebar}>
          <div className={cls.skeletonBlock}>
            <div className={`${cls.shimmer} ${cls.row}`} style={{ width: '40%' }} />
            <div className={`${cls.shimmer} ${cls.row}`} style={{ marginTop: 12 }} />
            <div className={`${cls.shimmer} ${cls.row}`} style={{ marginTop: 8, width: '70%' }} />
            <div className={`${cls.shimmer} ${cls.row}`} style={{ marginTop: 8, width: '50%' }} />
          </div>
          <div className={cls.skeletonBlock}>
            <div className={`${cls.shimmer} ${cls.row}`} style={{ width: '35%' }} />
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`${cls.shimmer} ${cls.row}`} style={{ marginTop: 8 }} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
