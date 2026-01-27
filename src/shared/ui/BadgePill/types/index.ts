export type BadgePillColor = 'red' | 'green' | 'blue' | 'orange' | 'gray' | 'purple';
export type BadgePillSize = 'small' | 'medium' | 'large';
export type BadgePillHoverColor = 'red' | 'green' | 'blue' | 'orange' | 'gray' | 'purple';

export interface BadgePillProps {
  text: string;
  color: BadgePillColor;
  size: BadgePillSize;
  hover?: BadgePillHoverColor;
  className?: string;
}
