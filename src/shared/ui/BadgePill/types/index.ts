export type BadgePillColor = 'red' | 'green' | 'blue' | 'orange' | 'gray' | 'purple';
export type BadgePillSize = 'small' | 'medium' | 'large';

export interface BadgePillProps {
  text: string;
  color: BadgePillColor;
  size: BadgePillSize;
  className?: string;
}
