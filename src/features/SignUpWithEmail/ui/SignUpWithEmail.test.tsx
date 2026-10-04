import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SignUpWithEmail } from './SignUpWithEmail';

const HINT = 'At least 8 characters';
const TOO_SHORT = 'Password must be at least 8 characters long';

const renderForm = () =>
  render(
    <MockedProvider mocks={[]}>
      <SignUpWithEmail onFormSent={vi.fn()} onSwitchToSignIn={vi.fn()} setError={vi.fn()} />
    </MockedProvider>,
  );

describe('SignUpWithEmail', () => {
  it('shows the password length hint before anything is typed', () => {
    renderForm();

    expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleDescription(HINT);
  });

  it('replaces the hint with the error once the password is too short', async () => {
    renderForm();
    const user = userEvent.setup();
    const password = screen.getByLabelText(/^password$/i);
    expect(password).toHaveAccessibleDescription(HINT);

    await user.type(password, 'short');

    await waitFor(() => expect(password).toHaveAccessibleDescription(TOO_SHORT));
    expect(screen.queryByText(HINT)).not.toBeInTheDocument();
  });
});
