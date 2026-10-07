import { useRef } from 'react';
import { type NeighborhoodSection } from '../../../types';
import { useCurrentSection } from '../hooks/useCurrentSection';
import { useGoToSection } from '../hooks/useGoToSection';
import { useKeepCurrentInView } from '../hooks/useKeepCurrentInView';
import { type SwitcherSection } from '../types';
import cls from './SectionSwitcher.module.scss';

interface SectionSwitcherProps {
  /** The page's sections, in page order. */
  sections: readonly SwitcherSection[];
  /** Called when a section's link is tapped. */
  onNavigate: (target: NeighborhoodSection) => void;
}

/** A row of links to the page's sections that sticks under the navbar and marks the section in view. */
export const SectionSwitcher = ({ sections, onNavigate }: SectionSwitcherProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const current = useCurrentSection(sections.map(({ anchor }) => anchor));
  useKeepCurrentInView(listRef, current);
  const goTo = useGoToSection(onNavigate);

  return (
    <nav className={cls.switcher} aria-label="Sections">
      <ul ref={listRef} className={cls.list}>
        {sections.map((section) => (
          <li key={section.anchor}>
            <a
              href={`#${section.anchor}`}
              className={cls.link}
              aria-current={section.anchor === current ? 'location' : undefined}
              onClick={(event) => {
                goTo(event, section);
              }}
            >
              {section.label}
              {section.count !== undefined && (
                <>
                  {' '}
                  <span className={cls.count}>{section.count}</span>
                </>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
