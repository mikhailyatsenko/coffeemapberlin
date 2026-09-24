import { type CharacteristicCounts } from 'shared/generated/graphql';

import { useCharacteristicQuestions } from '../model/useCharacteristicQuestions';
import cls from './CharacteristicQuestions.module.scss';

interface CharacteristicQuestionsProps {
  placeId: string;
  characteristicCounts: CharacteristicCounts;
}

/** Yes / Skip questions about the opinion Characteristics the person hasn't marked yet. */
export const CharacteristicQuestions = ({ placeId, characteristicCounts }: CharacteristicQuestionsProps) => {
  const { containerRef, questions, hasMoreQuestions, showMoreQuestions, answerYes, skip, error } =
    useCharacteristicQuestions(placeId, characteristicCounts);

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
      {error && (
        <p className={cls.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
