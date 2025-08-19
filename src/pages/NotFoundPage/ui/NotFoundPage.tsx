import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import cls from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = '404 — Page not found | Berlin Coffee Map';

    const head = document.head;

    const robotsMeta = head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const createdRobots = !robotsMeta;
    const robotsEl = robotsMeta ?? document.createElement('meta');
    const prevRobotsContent = robotsMeta?.getAttribute('content') ?? null;
    robotsEl.setAttribute('name', 'robots');
    robotsEl.setAttribute('content', 'noindex, nofollow');
    if (createdRobots) head.appendChild(robotsEl);

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

  return (
    <section className={`${cls.NotFoundPage} container`} aria-labelledby="not-found-title">
      <h1 id="not-found-title" className={cls.title}>
        Page not found
      </h1>
      <p className={cls.description}>The page you are looking for doesn’t exist or may have been moved.</p>

      <div className={cls.actions}>
        <Link to={RoutePaths.main} className={cls.primaryAction} aria-label="Go to homepage">
          Go to homepage
        </Link>
        <Link to={`/${RoutePaths.contacts}`} className={cls.secondaryAction} aria-label="Contact us">
          Contact us
        </Link>
      </div>

      <p className={cls.code} aria-hidden="true">
        Error code: 404
      </p>
    </section>
  );
};
