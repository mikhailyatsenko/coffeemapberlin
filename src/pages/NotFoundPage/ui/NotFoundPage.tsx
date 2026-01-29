import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import cls from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  return (
    <section className={`${cls.NotFoundPage} container`} aria-labelledby="not-found-title">
      <Helmet>
        <title>404 — Page not found | Berlin Coffee Map</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="prerender-status-code" content="404" />
      </Helmet>
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
