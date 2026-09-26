import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';

import { type SavingToggles } from '../../../types';
import { ErrorAlert } from '../../ErrorAlert';
import { useCharacteristicQuestions } from '../model/useCharacteristicQuestions';
import cls from './CharacteristicQuestions.module.scss';

interface CharacteristicQuestionsProps extends SavingToggles {
  placeId: string;
  characteristicCounts: CharacteristicCounts;
  /** Characteristics not to ask about in this page view: skipped, or removed from the person's marks. */
  dismissed: readonly Characteristic[];
  onSkip: (characteristic: Characteristic) => void;
}

/** Yes / Skip questions about the opinion Characteristics the person hasn't marked yet. */
export const CharacteristicQuestions = (props: CharacteristicQuestionsProps) => {
  const { containerRef, questions, hasMoreQuestions, showMoreQuestions, answerYes, skip, error } =
    useCharacteristicQuestions(props);

  return (
    <div ref={containerRef} className={cls.CharacteristicQuestions}>
      {questions.map(({ characteristic, text }) => (
        <fieldset key={characteristic} className={cls.question}>
          <legend className={cls.text}>{text}</legend>
          <div className={cls.answers}>
            <button
              type="button"
              className={cls.yes}
              onClick={async () => {
                await answerYes(characteristic);
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className={cls.skip}
              onClick={() => {
                skip(characteristic);
              }}
            >
              Skip
            </button>
          </div>
        </fieldset>
      ))}
      {hasMoreQuestions && (
        <button type="button" className={cls.more} onClick={showMoreQuestions}>
          More questions?
        </button>
      )}
      {error && <ErrorAlert>{error}</ErrorAlert>}
    </div>
  );
};
