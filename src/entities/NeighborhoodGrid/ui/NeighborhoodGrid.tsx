import clsx from 'clsx';
import { type NeighborhoodGridCellProps, type NeighborhoodGridProps } from '../types';
import cls from './NeighborhoodGrid.module.scss';

export const NeighborhoodGrid = ({ label, children }: NeighborhoodGridProps) => (
  <div className={cls.grid} role="group" aria-label={label}>
    {children}
  </div>
);

export const NeighborhoodGridCell = ({ children, onClick, pressed }: NeighborhoodGridCellProps) => (
  <button className={clsx(cls.cell, pressed && cls.pressed)} onClick={onClick} type="button" aria-pressed={pressed}>
    {children}
  </button>
);
