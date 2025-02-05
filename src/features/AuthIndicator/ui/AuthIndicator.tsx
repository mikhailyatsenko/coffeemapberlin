import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthHandlers } from 'shared/lib/hooks/auth/useAuthHandlers';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './AuthIndicator.module.scss';

export const AuthIndicator: React.FC = () => {
  const { user, setAuthModalContentVariant } = useAuth();
  const { logout } = useAuthHandlers();

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
    return (
      <RegularButton
        onClick={() => {
          setAuthModalContentVariant('SignInWithEmail');
        }}
      >
        Sign in
      </RegularButton>
    );
  }

  return (
    <div className={cls.authIndicator} ref={authIndicatorRef}>
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
            logout();
          }}
        >
          Sign out
        </div>
      </div>
    </div>
  );
};
