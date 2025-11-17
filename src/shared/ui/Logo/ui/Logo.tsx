import logo from '../../../assets/logo.svg';
import cls from './Logo.module.scss';

export const Logo = () => {
  return (
    <div className={cls.Logo}>
      <img width={32} height={32} src={logo} alt="logo" />
      <div className={cls.logoText}>
        <div className={cls.primaryText}>
          3.Welle<sup> berlin</sup>
        </div>
        <div className={cls.secondaryText}>Good coffee map </div>
      </div>
    </div>
  );
};
