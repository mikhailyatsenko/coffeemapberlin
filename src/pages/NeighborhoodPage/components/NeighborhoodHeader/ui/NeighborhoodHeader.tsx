import { type ReactNode } from 'react';
import cls from './NeighborhoodHeader.module.scss';

interface NeighborhoodHeaderProps {
  neighborhood: string;
  /** What goes under the title: the Neighborhood's summary, its skeleton, or nothing. */
  children?: ReactNode;
}

/** The page title, with the Neighborhood's summary under it. */
export const NeighborhoodHeader = ({ neighborhood, children }: NeighborhoodHeaderProps) => (
  <header className={cls.header}>
    <h1>Best Coffee Places in {neighborhood}</h1>
    {children}
  </header>
);
