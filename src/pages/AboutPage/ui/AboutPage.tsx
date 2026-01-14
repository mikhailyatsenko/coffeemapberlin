import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import cls from './AboutPage.module.scss';

export const AboutPage = () => {
  useEffect(() => {
    document.title = 'About | Berlin Coffee Map';
    return () => {
      document.title = 'Berlin Coffee Map';
    };
  }, []);
  return (
    <main className={`${cls.AboutPage} container`} style={{ textAlign: 'center' }}>
      <h1>About</h1>
      <p className={cls.text}>
        Love delicious coffee? Want to know where to find the best brews in Berlin — or a cozy, atmospheric spot to
        relax? Maybe both. You’re in the{' '}
        <Link to={'/'} className={cls.link}>
          right place.
        </Link>
      </p>

      <p className={cls.text}>
        Our site helps you discover the perfect coffee places across the city. Browse photos, read honest reviews, and
        share your own experiences to help others. Save your favorite cafés or mark the ones you want to visit so you
        never forget a place worth trying.
      </p>

      <p className={cls.text}>
        We’re a small team of coffee lovers who are passionate about helping you find the perfect coffee shop in Berlin.
        We’re always looking for new places to add to our map, so if you know of a good one, please let us know through
        our{' '}
        <Link to={'/contacts'} className={cls.link}>
          contact form.
        </Link>
      </p>
    </main>
  );
};
