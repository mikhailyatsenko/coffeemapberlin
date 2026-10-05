import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AvailableNeighborhoodsDocument } from 'shared/generated/graphql';
import { Navbar } from './Navbar';

const neighborhoods = ['Mitte', 'Pankow', 'Charlottenburg-Wilmersdorf'];

const availableNeighborhoodsMock: MockedResponse = {
  request: { query: AvailableNeighborhoodsDocument },
  result: {
    data: {
      availableNeighborhoods: {
        __typename: 'AvailableNeighborhoodsResult',
        neighborhoods,
        total: neighborhoods.length,
      },
    },
  },
};

const LandingPage = () => {
  const { neighborhood } = useParams();
  return <p>Landing page: {neighborhood}</p>;
};

const renderNavbar = () =>
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <MockedProvider mocks={[availableNeighborhoodsMock]}>
        <MemoryRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={null} />
            <Route path="/neighborhood/:neighborhood" element={<LandingPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </GoogleOAuthProvider>,
  );

describe('Navbar', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it('labels the neighborhoods dropdown trigger "Neighborhoods"', () => {
    renderNavbar();

    expect(screen.getByRole('button', { name: 'Neighborhoods' })).toBeInTheDocument();
  });

  describe('on desktop', () => {
    it('shows the Neighborhoods as a grid and goes to the picked one, closing the panel', async () => {
      renderNavbar();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: 'Neighborhoods' }));

      const grid = screen.getByRole('group', { name: 'Neighborhoods' });
      for (const name of neighborhoods) {
        expect(await within(grid).findByRole('button', { name })).toBeInTheDocument();
      }

      await user.click(within(grid).getByRole('button', { name: 'Pankow' }));

      expect(screen.getByText('Landing page: pankow')).toBeInTheDocument();
      expect(screen.queryByRole('group', { name: 'Neighborhoods' })).not.toBeInTheDocument();
    });

    it('closes the panel on a click outside it', async () => {
      renderNavbar();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: 'Neighborhoods' }));
      expect(screen.getByRole('group', { name: 'Neighborhoods' })).toBeInTheDocument();

      await user.click(document.body);

      expect(screen.queryByRole('group', { name: 'Neighborhoods' })).not.toBeInTheDocument();
    });
  });

  describe('on mobile', () => {
    const renderMobileNavbar = () => {
      vi.stubGlobal('innerWidth', 390);
      return renderNavbar();
    };

    it('expands the grid inline in the menu and collapses it on a second tap, with no dialog', async () => {
      renderMobileNavbar();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /open menu/i }));
      const trigger = screen.getByRole('button', { name: 'Neighborhoods' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      const grid = screen.getByRole('group', { name: 'Neighborhoods' });
      expect(await within(grid).findByRole('button', { name: 'Mitte' })).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('group', { name: 'Neighborhoods' })).not.toBeInTheDocument();
    });

    it('goes to the picked Neighborhood and closes the menu', async () => {
      renderMobileNavbar();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /open menu/i }));
      await user.click(screen.getByRole('button', { name: 'Neighborhoods' }));
      await user.click(await screen.findByRole('button', { name: 'Charlottenburg-Wilmersdorf' }));

      expect(screen.getByText('Landing page: charlottenburg-wilmersdorf')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens the menu with the grid collapsed after closing it expanded', async () => {
      renderMobileNavbar();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /open menu/i }));
      await user.click(screen.getByRole('button', { name: 'Neighborhoods' }));
      expect(screen.getByRole('group', { name: 'Neighborhoods' })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /close menu/i }));
      await user.click(screen.getByRole('button', { name: /open menu/i }));

      expect(screen.getByRole('button', { name: 'Neighborhoods' })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('group', { name: 'Neighborhoods' })).not.toBeInTheDocument();
    });
  });
});
