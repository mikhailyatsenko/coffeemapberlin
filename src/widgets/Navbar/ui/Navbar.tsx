import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, generatePath } from 'react-router-dom';
// eslint-disable-next-line boundaries/element-types
import { AuthModal } from 'widgets/AuthModal'; // TODO: fix import according to feature-sliced design
import { AuthIndicator } from 'features/AuthIndicator';
import { NeighborhoodDropdown } from 'features/NeighborhoodDropdown';
import { SearchPlaces } from 'features/SearchPlaces';
import { RoutePaths } from 'shared/constants';
import { Logo } from 'shared/ui/Logo';
import cls from './Navbar.module.scss';
export const Navbar = () => {
  const [isBurgerActive, setIsBurgerActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setIsBurgerActive(false);
    });

    return () => {
      window.removeEventListener('scroll', () => {
        setIsBurgerActive(false);
      });
    };
  }, []);

  const handleNeighborhoodSelect = (neighborhood: string) => {
    setIsBurgerActive(false);
    const path = generatePath(`/${RoutePaths.neighborhood}`, {
      neighborhood: encodeURIComponent(neighborhood.toLowerCase()),
    });
    navigate(path);
  };

  return (
    <nav className={cls.navbar}>
      {isBurgerActive ? (
        <div
          onClick={() => {
            setIsBurgerActive(false);
          }}
          className={cls.menuOverlay}
        ></div>
      ) : (
        ''
      )}
      <NavLink to={'/'}>
        <div className={cls.logo}>
          <Logo />
        </div>
      </NavLink>

      <div className={cls.buttonsRight}>
        {location.pathname === '/' && !isBurgerActive && <SearchPlaces />}
        <ul className={`${cls.navMenu} ${isBurgerActive ? `${cls.active}` : ''}`}>
          <li className={cls.navItem}>
            <NavLink
              onClick={() => {
                setIsBurgerActive(false);
              }}
              className={({ isActive }) => (isActive ? `${cls.active} ${cls.navLink}` : '')}
              to={'/'}
            >
              Coffee Map
            </NavLink>
          </li>
          <li className={cls.navItem}>
            <NeighborhoodDropdown onSelect={handleNeighborhoodSelect} />
          </li>
          <li className={cls.navItem}>
            <NavLink
              onClick={() => {
                setIsBurgerActive(false);
              }}
              className={({ isActive }) => (isActive ? `${cls.active} ${cls.navLink}` : '')}
              to={'about'}
            >
              About
            </NavLink>
          </li>
          <li className={cls.navItem}>
            <NavLink
              onClick={() => {
                setIsBurgerActive(false);
              }}
              className={({ isActive }) => (isActive ? `${cls.active} ${cls.navLink}` : '')}
              to={'contacts'}
            >
              Contact
            </NavLink>
          </li>
        </ul>
        <AuthIndicator />
        <AuthModal />
        <div
          onClick={() => {
            setIsBurgerActive((prevState) => !prevState);
          }}
          className={clsx(cls.hamburger, isBurgerActive && cls.active)}
        >
          <span className={cls.bar}></span>
          <span className={cls.bar}></span>
          <span className={cls.bar}></span>
        </div>
      </div>
    </nav>
  );
};
