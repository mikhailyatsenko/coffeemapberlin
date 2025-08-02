import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { clsx } from 'yet-another-react-lightbox';
import { Spinner } from 'shared/ui/Loader';

import cls from './ImgWithLoader.module.scss';

interface ImgWithLoaderProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const ImgWithLoader = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
  ...imgProps
}: ImgWithLoaderProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageLoaded(true); // Hide loader even on error
    onError?.();
  };

  useEffect(() => {
    setImageLoaded(false);
  }, [src]);

  return (
    <>
      <img
        key={src}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={clsx(cls.img, className)}
        {...imgProps}
      />
      {!imageLoaded && (
        <div className={cls.fallback}>
          <Spinner />
        </div>
      )}
    </>
  );
};
