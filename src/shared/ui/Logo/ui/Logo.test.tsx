import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders logo image and text', () => {
    render(<Logo />);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText(/3\.Welle/)).toBeInTheDocument();
  });
});
