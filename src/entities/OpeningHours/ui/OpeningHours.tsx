import React, { useMemo, useState, useCallback } from 'react';
import { Modal } from 'shared/ui/Modal';
import { RegularButton } from 'shared/ui/RegularButton';
import { DAY_ORDER, DAY_SHORT_NAMES } from '../constants';
import { type OpeningHoursProps } from '../types';
import './OpeningHours.scss';

const OpeningHoursList: React.FC<{ openingHours: OpeningHoursProps['openingHours'] }> = ({ openingHours }) => {
  const sortedOpeningHours = useMemo(() => {
    const hoursMap = new Map(openingHours.map((item) => [item.day, item.hours]));
    return DAY_ORDER.map((day) => ({
      day,
      hours: hoursMap.get(day) || 'Closed',
    }));
  }, [openingHours]);

  return (
    <div className="opening-hours-list">
      {sortedOpeningHours.map(({ day, hours }) => (
        <div key={day} className="opening-hours-item">
          <span className="opening-hours-day">{DAY_SHORT_NAMES[day as keyof typeof DAY_SHORT_NAMES]}</span>
          <span className="opening-hours-time">{hours}</span>
        </div>
      ))}
    </div>
  );
};

export const OpeningHours: React.FC<OpeningHoursProps> = ({ openingHours }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const todayInfo = useMemo(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const found = openingHours.find((item) => item.day === today);
    return found ? found.hours : 'Closed';
  }, [openingHours]);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <div className="opening-hours-today">
        <span className="opening-hours-today-label">Today open:</span>
        <span className="opening-hours-today-value">{todayInfo}</span>
      </div>
      <RegularButton className="opening-hours-button" onClick={handleOpenModal} type="button">
        Show all days
      </RegularButton>
      {modalOpen && (
        <Modal onClose={handleCloseModal} widthOnDesktop={400}>
          <h3 className="opening-hours-title" style={{ marginTop: 0 }}>
            Opening Hours
          </h3>
          <OpeningHoursList openingHours={openingHours} />
        </Modal>
      )}
    </>
  );
};
