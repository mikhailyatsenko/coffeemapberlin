import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import cls from './NotFoundPlace.module.scss';

export const NotFoundPlace: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const address = searchParams.get('address') ?? '';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = '404 — Place not found | Berlin Coffee Map';

    const head = document.head;

    // robots noindex/nofollow for 404
    const robotsMeta = head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const createdRobots = !robotsMeta;
    const robotsEl = robotsMeta ?? document.createElement('meta');
    const prevRobotsContent = robotsMeta?.getAttribute('content') ?? null;
    robotsEl.setAttribute('name', 'robots');
    robotsEl.setAttribute('content', 'noindex, nofollow');
    if (createdRobots) head.appendChild(robotsEl);

    // prerender status code hint (used by some prerendering services)
    const prerenderMeta = document.createElement('meta');
    prerenderMeta.setAttribute('name', 'prerender-status-code');
    prerenderMeta.setAttribute('content', '404');
    head.appendChild(prerenderMeta);

    return () => {
      document.title = previousTitle;
      if (createdRobots) {
        robotsEl.remove();
      } else if (prevRobotsContent !== null) {
        robotsEl.setAttribute('content', prevRobotsContent);
      }
      prerenderMeta.remove();
    };
  }, []);

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className={cls.wrapper}>
      <div className={cls.content}>
        <h1 className={cls.title}>404</h1>
        <h2 className={cls.title}>Place not found</h2>
        {address ? <p className={cls.subTitle}>{address}</p> : null}
        <p className={cls.description}>The place you are looking for does not exist or is unavailable.</p>
        <button className={cls.homeBtn} onClick={goHome}>
          Go to map
        </button>
      </div>
    </div>
  );
};
