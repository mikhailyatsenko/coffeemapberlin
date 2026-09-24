import clsx from 'clsx';
import { useMemo } from 'react';
import { DAY_ORDER, DAY_SHORT_NAMES } from 'entities/OpeningHours/constants';
import { type OpeningHoursProps } from 'entities/OpeningHours/types';
import cls from './OpeningHoursList.module.scss';

export const OpeningHoursList: React.FC<{ openingHours: OpeningHoursProps['openingHours']; todayDay: string }> = ({
  openingHours,
  todayDay,
}) => {
  const sortedOpeningHours = useMemo(() => {
    const hoursMap = new Map(openingHours?.map((item) => [item.day, item.hours]));
    return DAY_ORDER.map((day) => ({
      day,
      hours: hoursMap.get(day) || 'Closed',
    }));
  }, [openingHours]);

  if (!openingHours || openingHours.length === 0) return null;

  return (
    <div className={cls.openingHoursList}>
      {sortedOpeningHours.map(({ day, hours }) => (
        <div key={day} className={clsx(cls.openingHoursItem, { [cls.today]: day === todayDay })}>
          <span className={cls.openingHoursDay}>{DAY_SHORT_NAMES[day as keyof typeof DAY_SHORT_NAMES]}</span>
          <span className={cls.openingHoursTime}>{hours}</span>
        </div>
      ))}
    </div>
  );
};
