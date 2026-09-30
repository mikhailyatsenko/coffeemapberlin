import { afterEach, describe, expect, it } from 'vitest';
import { executeRecaptcha, RecaptchaUnavailableError } from './executeRecaptcha';

const SCRIPT_ID = 'recaptcha-v3';

describe('executeRecaptcha', () => {
  afterEach(() => {
    document.getElementById(SCRIPT_ID)?.remove();
    delete window.grecaptcha;
  });

  it('retries instead of caching the failure forever when grecaptcha never initialised', async () => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    document.head.appendChild(script);

    await expect(executeRecaptcha('contact_form')).rejects.toBeInstanceOf(RecaptchaUnavailableError);

    window.grecaptcha = {
      ready: (cb) => {
        cb();
      },
      execute: async () => 'token-1',
    };

    await expect(executeRecaptcha('contact_form')).resolves.toBe('token-1');
  });
});
