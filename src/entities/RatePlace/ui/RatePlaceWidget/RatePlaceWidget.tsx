import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
// import { RegularButton } from 'shared/ui/RegularButton';
import cls from './RatePlaceWidget.module.scss';

interface RatePlaceWidgetProps {
  userRating?: number;
  onSubmitRating: (rating: number) => void;
}

export const RatePlaceWidget = ({ onSubmitRating, userRating }: RatePlaceWidgetProps) => {
  return (
    <div className={cls.rateWidget}>
      {userRating ? (
        <>
          <h3>Your rating</h3>
          <div className={cls.currentUserRate}>
            <BeanIcon filled />
            <div className={cls.currentUserRateNumber}>{userRating}</div>
          </div>
          {/* <RegularButton theme="blank">Delete my rating</RegularButton> */}
        </>
      ) : (
        <>
          <h3>Rate this place</h3>
          <RatingWidget isClickable={true} handleRating={onSubmitRating} />
        </>
      )}
    </div>
  );
};
