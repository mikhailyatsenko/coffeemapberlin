import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthIndicator } from 'features/AuthIndicator';
import { SearchPlaces } from 'features/SearchPlaces';
import { AuthModal } from 'entities/AuthModal';
import { Logo } from 'shared/ui/Logo';
import cls from './Navbar.module.scss';
export const Navbar = () => {
  const [isBurgerActive, setIsBurgerActive] = useState(false);
  const location = useLocation();
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
        <ul className={`${cls.navMenu} ${isBurgerActive ? cls.active : ''}`}>
          <li className={cls.navItem}>
            <NavLink
              onClick={() => {
                setIsBurgerActive(false);
              }}
              className={({ isActive }) => (isActive ? cls.active : '')}
              to={'/'}
            >
              Map
            </NavLink>
          </li>
          <li className={cls.navItem}>
            <NavLink
              onClick={() => {
                setIsBurgerActive(false);
              }}
              className={({ isActive }) => (isActive ? cls.active : '')}
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
              className={({ isActive }) => (isActive ? cls.active : '')}
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
          className={`${cls.hamburger} ${isBurgerActive ? cls.active : ''}`}
        >
          <span className={cls.bar}></span>
          <span className={cls.bar}></span>
          <span className={cls.bar}></span>
        </div>
      </div>
    </nav>
  );
};
