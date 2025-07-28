import bkg from '../../../assets/default-bkg.jpg';
import cls from './BackgroundTexture.module.scss';

interface BackgroundTextureProps {
  image?: string;
}

export const BackgroundTexture = ({ image }: BackgroundTextureProps) => {
  return <img className={cls.backgroundImage} src={image || bkg} alt="background image" />;
};
