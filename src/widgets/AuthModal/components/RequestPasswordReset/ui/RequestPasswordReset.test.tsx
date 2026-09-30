import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RequestPasswordResetDocument } from 'shared/generated/graphql';
import { RecaptchaUnavailableError } from 'shared/lib/recaptcha';
import { RequestPasswordReset } from './RequestPasswordReset';

const executeRecaptcha = vi.fn();
vi.mock('shared/lib/recaptcha', async (importOriginal) => ({
  ...(await importOriginal()),
  executeRecaptcha: (action: string) => executeRecaptcha(action),
}));

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock('react-hot-toast', () => ({
  toast: { success: (...args: unknown[]) => toastSuccess(...args), error: (...args: unknown[]) => toastError(...args) },
}));

const EMAIL = 'ada@example.com';

const successMock = (onCall = () => {}): MockedResponse => ({
  request: { query: RequestPasswordResetDocument, variables: { email: EMAIL, captchaToken: 'token-1' } },
  result: () => {
    onCall();
    return { data: { requestPasswordReset: { success: true } } };
  },
});

const rateLimitedMock = (message: string): MockedResponse => ({
  request: { query: RequestPasswordResetDocument, variables: { email: EMAIL, captchaToken: 'token-1' } },
  result: { errors: [new GraphQLError(message, { extensions: { code: 'RATE_LIMITED' } })] },
});

const renderForm = (mocks: MockedResponse[], onSent = vi.fn()) => {
  render(
    <MockedProvider mocks={mocks}>
      <RequestPasswordReset onSent={onSent} />
    </MockedProvider>,
  );
  return { onSent };
};

const submit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/e-mail/i), EMAIL);
  await user.click(screen.getByRole('button', { name: /send reset link/i }));
};

describe('RequestPasswordReset', () => {
  beforeEach(() => {
    executeRecaptcha.mockReset();
    toastSuccess.mockReset();
    toastError.mockReset();
  });

  it('sends captchaToken with the request_password_reset action', async () => {
    executeRecaptcha.mockResolvedValue('token-1');
    const onCall = vi.fn();
    const { onSent } = renderForm([successMock(onCall)]);
    const user = userEvent.setup();

    await submit(user);

    await waitFor(() => {
      expect(onCall).toHaveBeenCalled();
    });
    expect(executeRecaptcha).toHaveBeenCalledWith('request_password_reset');
    expect(onSent).toHaveBeenCalled();
  });

  it('shows the blocked-verification message and sends no mutation when reCAPTCHA is blocked', async () => {
    executeRecaptcha.mockRejectedValue(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    const { onSent } = renderForm([]);
    const user = userEvent.setup();

    await submit(user);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(expect.stringContaining('reCAPTCHA was blocked'), expect.anything());
    });
    expect(onSent).not.toHaveBeenCalled();
  });

  it('shows the server message when the form is rate limited', async () => {
    executeRecaptcha.mockResolvedValue('token-1');
    const message = "You've made too many requests. Try again later.";
    renderForm([rateLimitedMock(message)]);
    const user = userEvent.setup();

    await submit(user);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(message, expect.anything());
    });
  });

  it('disables the button while minting a token, so a rapid double click sends one mutation', async () => {
    let resolveToken: (token: string) => void = () => {};
    executeRecaptcha.mockImplementation(
      async () =>
        await new Promise<string>((resolve) => {
          resolveToken = resolve;
        }),
    );
    const onCall = vi.fn();
    renderForm([successMock(onCall)]);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/e-mail/i), EMAIL);
    const button = screen.getByRole('button', { name: /send reset link/i });
    await user.click(button);

    await waitFor(() => expect(button).toBeDisabled());
    await user.click(button);

    resolveToken('token-1');

    await waitFor(() => {
      expect(onCall).toHaveBeenCalledTimes(1);
    });
  });

  it('shows a message instead of failing silently when executeRecaptcha rejects with something other than RecaptchaUnavailableError', async () => {
    executeRecaptcha.mockRejectedValue(new Error('reCAPTCHA site key is not configured'));
    const { onSent } = renderForm([]);
    const user = userEvent.setup();

    await submit(user);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "We couldn't save that. Please check your connection and try again.",
        expect.anything(),
      );
    });
    expect(onSent).not.toHaveBeenCalled();
  });
});
