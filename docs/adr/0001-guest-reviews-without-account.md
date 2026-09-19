# Guests can review without an account

Guests can rate and review Places without signing up, to keep the barrier low. A Guest passes reCAPTCHA once and receives a Guest identity (a `guestId`/`guestSecret` pair) kept only in their browser; later actions use that pair instead of a new captcha, and the Guest can Claim their Reviews and Favorites into an account after signing in. We rejected requiring sign-in (too much friction for a one-off Rating) and a captcha on every action (annoying, and gives no way to edit or Claim a Review later).
