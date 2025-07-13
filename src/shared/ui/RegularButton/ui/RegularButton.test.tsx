import { render, screen, fireEvent } from '@testing-library/react';
import { RegularButton } from './RegularButton';

describe('RegularButton', () => {
  it('renders children', () => {
    render(<RegularButton>Click me</RegularButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<RegularButton onClick={handleClick}>Click</RegularButton>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<RegularButton disabled>Disabled</RegularButton>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
