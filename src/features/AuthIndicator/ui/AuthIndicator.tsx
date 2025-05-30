import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuth, useAuthStore } from 'shared/stores/auth';
import { showSignIn } from 'shared/stores/modal';
import { Loader } from 'shared/ui/Loader';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './AuthIndicator.module.scss';

export const AuthIndicator: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const logoutHandler = async () => {
    try {
      setIsLoading(true);
      await clearAuth();
      navigate('/', { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isProfileCardVisible, setIsProfileCardVisible] = useState(false);
  const authIndicatorRef = useRef<HTMLDivElement>(null);

  const toggleProfileCard = () => {
    setIsProfileCardVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileCardVisible &&
        authIndicatorRef.current &&
        !authIndicatorRef.current.contains(event.target as Node)
      ) {
        setIsProfileCardVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileCardVisible]);

  if (!user) {
    return <RegularButton onClick={showSignIn}>Sign in</RegularButton>;
  }

  return (
    <div className={cls.authIndicator} ref={authIndicatorRef}>
      {isLoading ? <Loader /> : null}
      <div
        className={cls.userAvatar}
        onClick={(e) => {
          e.stopPropagation();
          toggleProfileCard();
        }}
      >
        <img src={user?.avatar || './user-default-icon.svg'} alt="User avatar" referrerPolicy="no-referrer" />
      </div>

      <div className={`${cls.profileCard} ${isProfileCardVisible ? cls.visible : ''}`}>
        <div className={cls.profileCardAvatar}>
          <img src={user?.avatar || './user-default-icon.svg'} alt="User avatar" referrerPolicy="no-referrer" />
        </div>
        <p className={cls.profileName}>{user?.displayName}</p>
        <p className={cls.profileEmail}>{user?.email}</p>

        <NavLink
          onPointerUp={() => {
            setIsProfileCardVisible(false);
          }}
          to={'./profile'}
          className={cls.profileButton}
        >
          Account Settings
        </NavLink>

        <NavLink
          onPointerUp={() => {
            setIsProfileCardVisible(false);
          }}
          to={'my-reviews'}
          className={cls.profileButton}
        >
          My Reviews
        </NavLink>

        <div className={cls.divider}></div>
        <div
          className={cls.profileButton}
          onClick={() => {
            logoutHandler();
          }}
        >
          Sign out
        </div>
      </div>
    </div>
  );
};
