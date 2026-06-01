import { Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { Logo } from 'shared/ui/Logo';
import cls from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={cls.Footer}>
      <div className={cls.footerLogo}>
        <Logo />
      </div>
      <nav className={cls.footerLinks} aria-label="Legal links">
        <Link to={`/${RoutePaths.privacy}`} className={cls.link}>
          Privacy Policy
        </Link>
        <Link to={`/${RoutePaths.disclaimer}`} className={cls.link}>
          Disclaimer
        </Link>
      </nav>
      <a
        href="https://github.com/mikhailyatsenko/coffeemapberlin"
        target="_blank"
        rel="noopener noreferrer"
        className={cls.openSource}
      >
        Open source · Contributions welcome
      </a>
      <div className={cls.copyright}>&copy; {new Date().getFullYear()}</div>
    </footer>
  );
};
