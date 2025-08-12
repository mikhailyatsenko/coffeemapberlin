import React, { useMemo, useState, useCallback } from 'react';
import { Modal } from 'shared/ui/Modal';
import { OpeningHoursList } from '../components/OpeningHoursList/OpeningHoursList';

import { type OpeningHoursProps } from '../types';
import cls from './OpeningHours.module.scss';

export const OpeningHours: React.FC<OpeningHoursProps> = ({ openingHours }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const todayDay = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  }, []);

  const todayInfo = useMemo(() => {
    const found = openingHours?.find((item) => item.day === todayDay);
    return found ? found.hours : 'Closed';
  }, [openingHours, todayDay]);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);
  if (!openingHours || openingHours.length === 0) return null;

  return (
    <>
      <div className={cls.openingHoursToday}>
        <div className={cls.openingHoursTodayInfo}>
          {todayInfo === 'Closed' ? (
            <span className={cls.openingHoursClosed}>Today closed</span>
          ) : (
            <>
              <span className={cls.openingHoursTodayLabel}>Today open: &nbsp;</span>
              <span className={cls.openingHoursTodayValue}>{todayInfo}</span>
            </>
          )}
        </div>
        <button className={cls.openingHoursButton} onClick={handleOpenModal} type="button">
          Show all days schedule
        </button>
      </div>

      {modalOpen && (
        <Modal closeOnEsc={true} onClose={handleCloseModal} widthOnDesktop={400}>
          <h3 className={cls.openingHoursTitle}>Opening Hours</h3>
          <OpeningHoursList openingHours={openingHours} todayDay={todayDay} />
        </Modal>
      )}
    </>
  );
};
