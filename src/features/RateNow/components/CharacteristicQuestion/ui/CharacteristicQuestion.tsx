import cls from './CharacteristicQuestion.module.scss';

interface CharacteristicQuestionProps {
  text: string;
  onYes: () => Promise<void>;
  onSkip: () => void;
}

/** One Yes / Skip question about a Characteristic. */
export const CharacteristicQuestion = ({ text, onYes, onSkip }: CharacteristicQuestionProps) => (
  <fieldset className={cls.CharacteristicQuestion}>
    <legend className={cls.text}>{text}</legend>
    <div className={cls.answers}>
      <button
        type="button"
        className={cls.yes}
        onClick={async () => {
          await onYes();
        }}
      >
        Yes
      </button>
      <button type="button" className={cls.skip} onClick={onSkip}>
        Skip
      </button>
    </div>
  </fieldset>
);
