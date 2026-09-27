import { Link } from 'react-router-dom';
import cls from './SuggestionThanks.module.scss';

interface SuggestionThanksProps {
  /** Whether the suggester hears back when the Place is added. */
  willEmail: boolean;
}

export const SuggestionThanks = ({ willEmail }: SuggestionThanksProps) => (
  <div className={cls.SuggestionThanks} role="status">
    <p className={cls.title}>Thanks! We usually check suggestions within a couple of days.</p>
    {willEmail && <p>We&apos;ll email you when it&apos;s added.</p>}
    <Link className={cls.back} to="/">
      Back to the map
    </Link>
  </div>
);
