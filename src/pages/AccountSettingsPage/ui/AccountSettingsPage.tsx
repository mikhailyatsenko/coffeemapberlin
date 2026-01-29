import { Helmet } from 'react-helmet';
import { Account } from 'widgets/Account';
import cls from './AccountSettingsPage.module.scss';

export const AccountSettingsPage = () => {
  return (
    <div className="container">
      <Helmet>
        <title>Account Settings | Berlin Coffee Map</title>
      </Helmet>
      <h1 className={cls.pageTitle}>Account Settings</h1>
      <Account />
    </div>
  );
};
