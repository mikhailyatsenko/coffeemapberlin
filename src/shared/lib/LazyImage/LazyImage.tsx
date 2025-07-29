import React, { useEffect, useRef, useState } from 'react';
import { LoaderJustIcon } from 'shared/ui/Loader';

interface LazyImageProps {
  src: string;
  className?: string;
  alt?: string;
  key?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, key }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    const currentImgRef = imgRef.current;

    if (currentImgRef) {
      observer.observe(currentImgRef);
    }

    return () => {
      if (currentImgRef) {
        observer.unobserve(currentImgRef);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoaderJustIcon />}
      <img
        key={key}
        ref={imgRef}
        src={isVisible ? src : undefined}
        alt={alt}
        onLoad={handleLoad}
        style={{
          opacity: isLoading ? 0 : 1,
          visibility: isLoading ? 'hidden' : 'visible',
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </>
  );
};
