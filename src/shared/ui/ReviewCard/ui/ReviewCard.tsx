import { formatDistanceToNow } from 'date-fns';
import React, { useState, useMemo, useRef } from 'react';
import Lightbox, { type ZoomRef } from 'yet-another-react-lightbox';
import { Zoom } from 'yet-another-react-lightbox/plugins';

import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import DeleteIcon from '../../../assets/delete-icon.svg?react';
import EditIcon from '../../../assets/edit-icon.svg?react';
import { getReviewImages } from '../utils/getReviewImages';
import cls from './ReviewCard.module.scss';
import 'yet-another-react-lightbox/styles.css';

interface ReviewCardProps {
  placeId: string;
  reviewId: string;
  userAvatar?: string;
  userName: string;
  reviewText?: string;
  rating?: number;
  imgCount: number;
  isOwnReview?: boolean;
  handleDeleteReview?: (id: string) => void;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  createdAt: string;
  userId: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  placeId,
  reviewId,
  userAvatar,
  userName,
  reviewText,
  rating,
  imgCount,
  isOwnReview,
  handleDeleteReview,
  setShowRateNow,
  userId,
  createdAt,
}) => {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [imgLightboxIndex, setImgLightboxIndex] = useState(0);
  const zoomRef = useRef<ZoomRef>(null);
  const reviewImages = useMemo(() => getReviewImages(placeId, imgCount), [placeId, imgCount]);
  return (
    <div className={`${cls.reviewCard} ${isOwnReview ? cls.ownReview : ''}`}>
      {userId === 'google' && <div className={cls.googleReviewInfo}>This review was imported from Google Maps.</div>}
      <div className={cls.userInfo}>
        <img
          src={userAvatar || (userId === 'google' ? './google-maps.svg' : './user-default-icon.svg')}
          alt={userName}
          className={cls.avatar}
          referrerPolicy="no-referrer"
        />
        <span className={cls.userName}>{userName}</span>
        {rating && (
          <div className={cls.userRate}>
            <BeanIcon filled />
            <div className={cls.userRateNumber}>{rating}</div>
          </div>
        )}
      </div>

      <p className={cls.reviewText}>{!reviewText && rating ? `Rated: ${rating}` : reviewText}</p>

      {!!imgCount && (
        <>
          <div className={cls.reviewImages}>
            {reviewImages.map((url, idx) => (
              <img
                key={url}
                src={url}
                alt="Review image"
                className={cls.reviewImage}
                onClick={() => {
                  setImgLightboxIndex(idx);
                  setOpenLightbox(true);
                }}
              />
            ))}
          </div>
          <Lightbox
            zoom={{ ref: zoomRef, maxZoomPixelRatio: 2, doubleClickMaxStops: 1 }}
            plugins={[Zoom]}
            open={openLightbox}
            close={() => {
              setOpenLightbox(false);
            }}
            slides={reviewImages.map((url) => ({ src: url }))}
            index={imgLightboxIndex}
            on={{
              view: ({ index }) => {
                setImgLightboxIndex(index);
              },
            }}
          />
        </>
      )}

      <div className={cls.dateAndButtons}>
        <p className={cls.createdAt}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
        {isOwnReview && handleDeleteReview && (
          <div className={cls.buttons}>
            <EditIcon
              onClick={() => {
                setShowRateNow(true);
              }}
              className={cls.buttonIcon}
              title="Edit my feedback"
            />
            <DeleteIcon
              onClick={() => {
                const isConfirmed = window.confirm('Deleting review. Continue?');
                if (!isConfirmed) return;
                handleDeleteReview(reviewId);
              }}
              className={cls.buttonIcon}
              title="Delete my review"
            />
          </div>
        )}
      </div>
    </div>
  );
};
