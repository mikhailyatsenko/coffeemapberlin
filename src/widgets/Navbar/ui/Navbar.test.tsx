import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AvailableNeighborhoodsDocument } from 'shared/generated/graphql';
import { Navbar } from './Navbar';

const availableNeighborhoodsMock: MockedResponse = {
  request: { query: AvailableNeighborhoodsDocument },
  result: {
    data: { availableNeighborhoods: { __typename: 'AvailableNeighborhoodsResult', neighborhoods: [], total: 0 } },
  },
};

const renderNavbar = () =>
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <MockedProvider mocks={[availableNeighborhoodsMock]}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </MockedProvider>
    </GoogleOAuthProvider>,
  );

describe('Navbar', () => {
  it('opens the menu with a labeled, dimming overlay and flips the toggle name back on close', async () => {
    renderNavbar();
    const user = userEvent.setup();

    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();

    await user.click(toggle);

    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
    const overlay = document.querySelector('.menuOverlay');
    expect(overlay).toBeInTheDocument();

    await user.click(overlay!);

    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelector('.menuOverlay')).not.toBeInTheDocument();
  });
});
