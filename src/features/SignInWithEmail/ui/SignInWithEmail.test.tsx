import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { describe, expect, it, vi } from 'vitest';
import { SignInWithEmailDocument } from 'shared/generated/graphql';
import { SignInWithEmail } from './SignInWithEmail';

const EMAIL = 'ada@example.com';
const PASSWORD = 'password123';

const rateLimitedMock = (message: string): MockedResponse => ({
  request: { query: SignInWithEmailDocument, variables: { email: EMAIL, password: PASSWORD } },
  result: { errors: [new GraphQLError(message, { extensions: { code: 'RATE_LIMITED' } })] },
});

const renderForm = (mocks: MockedResponse[], setError = vi.fn()) => {
  render(
    <MockedProvider mocks={mocks}>
      <SignInWithEmail setError={setError} onSwitchToSignUp={vi.fn()} />
    </MockedProvider>,
  );
  return { setError };
};

describe('SignInWithEmail', () => {
  it('shows the server message, not a generic one, when sign-in is rate limited', async () => {
    const message = "You've made too many attempts. Try again later.";
    const { setError } = renderForm([rateLimitedMock(message)]);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/e-mail/i), EMAIL);
    await user.type(screen.getByLabelText(/password/i), PASSWORD);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith(expect.objectContaining({ message }));
    });
  });
});
