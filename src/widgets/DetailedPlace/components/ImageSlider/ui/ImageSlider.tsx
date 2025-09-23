import { throttle } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import LeftArrowIcon from 'shared/assets/left-arrow-icon.svg?react';
import RightArrowIcon from 'shared/assets/right-arrow-icon.svg?react';
import { IMAGEKIT_CDN_URL } from 'shared/constants';
import { ImgWithLoader } from 'shared/ui/ImgWithLoader';
import cls from './ImageSlider.module.scss';

interface ImageSliderProps {
  images: string[];
  placeName: string;
  className?: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ images, placeName, className }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback((scroller: Element) => {
    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding errors
  }, []);

  // Track scroll state for arrow visibility
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const scroller = document.querySelector(`.${cls.horizontalMediaScroller}`);
    if (!scroller) return;

    // Initial state
    updateScrollState(scroller);

    const handleScroll = throttle(() => {
      updateScrollState(scroller);
    }, 100);

    scroller.addEventListener('scroll', handleScroll);

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // Cancel any pending throttled calls
    };
  }, [images, updateScrollState]);

  if (!images || images.length <= 1) {
    return (
      <ImgWithLoader
        loading="eager"
        src={images?.length ? `${IMAGEKIT_CDN_URL}/${images[0]}` : '/places-images/default-place-img.jpg'}
        alt={`${placeName} main image`}
        className={className}
        errorFallbackUrl="/places-images/default-place-img.jpg"
      />
    );
  }

  return (
    <div className={cls.horizontalMediaScroller}>
      {images.map((image, index) => (
        <figure key={image} className={cls.scrollerItem}>
          <ImgWithLoader
            loading={index === 0 ? 'eager' : 'lazy'}
            src={`${IMAGEKIT_CDN_URL}/${image}`}
            alt={`${placeName} image ${index + 1}`}
            className={cls.scrollerImage}
            errorFallbackUrl="/places-images/default-place-img.jpg"
          />
        </figure>
      ))}

      {/* Navigation arrows */}
      {canScrollLeft && (
        <button
          className={cls.navArrowLeft}
          onClick={() => {
            const scroller = document.querySelector(`.${cls.horizontalMediaScroller}`);
            if (scroller) {
              scroller.scrollBy({ left: -scroller.clientWidth, behavior: 'smooth' });
            }
          }}
          aria-label="Previous image"
        >
          <LeftArrowIcon />
        </button>
      )}
      {canScrollRight && (
        <button
          className={cls.navArrowRight}
          onClick={() => {
            const scroller = document.querySelector(`.${cls.horizontalMediaScroller}`);
            if (scroller) {
              scroller.scrollBy({ left: scroller.clientWidth, behavior: 'smooth' });
            }
          }}
          aria-label="Next image"
        >
          <RightArrowIcon />
        </button>
      )}
    </div>
  );
};
