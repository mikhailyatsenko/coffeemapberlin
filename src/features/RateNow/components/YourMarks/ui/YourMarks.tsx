import { useId } from 'react';
import { ICON_CHAR_MAP } from 'shared/constants/iconCharMap';
import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';
import { characteristicsMap } from 'shared/ui/CharacteristicCountsIcon';

import { type SavingToggles } from '../../../types';
import { ErrorAlert } from '../../ErrorAlert';
import { useYourMarks } from '../model/useYourMarks';
import cls from './YourMarks.module.scss';

interface YourMarksProps extends SavingToggles {
  placeId: string;
  characteristicCounts: CharacteristicCounts;
  /** Called on a tap that starts a removal, before the server answers. */
  onRemove: (characteristic: Characteristic) => void;
  /** Takes focus once the last chip is removed. */
  onAllRemoved: () => void;
}

/** "Your marks": a removable chip for each Characteristic the person has marked. */
export const YourMarks = (props: YourMarksProps) => {
  const { listRef, marks, remove, error } = useYourMarks(props);
  const headingId = useId();

  return (
    <div className={cls.YourMarks}>
      {marks.length > 0 && (
        <>
          <p id={headingId} className={cls.heading}>
            Your marks
          </p>
          <ul ref={listRef} className={cls.chips} aria-labelledby={headingId}>
            {marks.map((characteristic) => {
              const Icon = ICON_CHAR_MAP[characteristic];
              const label = characteristicsMap.get(characteristic);
              return (
                <li key={characteristic}>
                  <button
                    type="button"
                    className={cls.chip}
                    aria-label={`Remove ${label}`}
                    onClick={async () => {
                      await remove(characteristic);
                    }}
                  >
                    <Icon className={cls.icon} width="16" height="16" aria-hidden />
                    {label}
                    <span aria-hidden>×</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {error && <ErrorAlert>{error}</ErrorAlert>}
    </div>
  );
};
