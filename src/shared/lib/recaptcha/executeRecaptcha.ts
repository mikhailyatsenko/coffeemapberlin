/**
 * reCAPTCHA v3. The script is loaded lazily on first use rather than in
 * index.html: it is only needed on a handful of submits, and it costs a request
 * plus a background scoring loop on every page otherwise.
 *
 * `action` must match the value the server verifies — a token minted for one
 * form is otherwise accepted on any other.
 */

export type RecaptchaAction = 'create_guest_identity' | 'register_user' | 'contact_form' | 'report_inaccuracy';

const SITE_KEY =
  process.env.VITE_ENV === 'development'
    ? process.env.RE_CAPTCHA_V3_SITE_KEY_DEV
    : process.env.RE_CAPTCHA_V3_SITE_KEY_PROD;

const SCRIPT_ID = 'recaptcha-v3';

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

let loader: Promise<Grecaptcha> | null = null;

const loadRecaptcha = async (): Promise<Grecaptcha> => {
  if (loader) return await loader;

  loader = new Promise<Grecaptcha>((resolve, reject) => {
    if (!SITE_KEY) {
      reject(new Error('reCAPTCHA site key is not configured'));
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);

    const onReady = () => {
      const grecaptcha = window.grecaptcha;
      if (!grecaptcha) {
        reject(new Error('reCAPTCHA failed to initialise'));
        return;
      }
      grecaptcha.ready(() => {
        resolve(grecaptcha);
      });
    };

    if (existing) {
      onReady();
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.onload = onReady;
    script.onerror = () => {
      // Allow a later attempt to retry the load instead of caching the failure.
      loader = null;
      reject(new Error('reCAPTCHA failed to load'));
    };
    document.head.appendChild(script);
  });

  return await loader;
};

/**
 * Returns a fresh token for the given action. Tokens are single use and expire
 * after two minutes, so call this immediately before the request that uses it.
 *
 * Throws when reCAPTCHA is unavailable: the server rejects requests it cannot
 * verify, so failing here gives the user a clearer message than the server can.
 */
export const executeRecaptcha = async (action: RecaptchaAction): Promise<string> => {
  const grecaptcha = await loadRecaptcha();
  return await grecaptcha.execute(SITE_KEY!, { action });
};
