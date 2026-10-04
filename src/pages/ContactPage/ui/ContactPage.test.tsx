import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
  it('shows the heading and its subtext above the form', () => {
    render(
      <MockedProvider mocks={[]}>
        <ContactPage />
      </MockedProvider>,
    );

    expect(screen.getByRole('heading', { level: 1, name: "Let's get in touch!" })).toBeInTheDocument();
    expect(screen.getByText("We're open for any suggestion or just to have a chat")).toBeInTheDocument();
  });
});
