import { useEffect, useState } from 'react';
import { LoaderJustIcon } from 'shared/ui/Loader';

import cls from './ImgWithLoader.module.scss';

interface ImgWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const ImgWithLoader = ({ src, alt, className = '', loading = 'lazy', onLoad, onError }: ImgWithLoaderProps) => {
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
        className={`${className}`}
      />
      {!imageLoaded && (
        <div className={cls.fallback}>
          <LoaderJustIcon />
        </div>
      )}
    </>
  );
};
