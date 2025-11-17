import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import cls from './AboutPage.module.scss';

export const AboutPage = () => {
  useEffect(() => {
    document.title = 'About | Berlin Coffee Map';
  }, []);
  return (
    <main className={`${cls.AboutPage} container`} style={{ textAlign: 'center' }}>
      <h1>Who are we?</h1>
      <p className={cls.text}>
        We&apos;re passionate coffee enthusiasts on a mission to help Berlin residents and visitors find great coffee.
        We gather information about top coffee shops from open sources and personal experiences, making it easy for you
        to find your perfect coffee shop on our{' '}
        <Link to={'/'} className={cls.link}>
          map.
        </Link>
      </p>
      <p className={cls.text}>
        As a young project still in development, we welcome your suggestions for improving our service. If you have
        ideas or know of a café that&apos;s not yet on our map, please contact us through our{' '}
        <Link to={'/contacts'} className={cls.link}>
          contact form.
        </Link>
      </p>
    </main>
  );
};
