import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

// findBy*/waitFor give up after 1s by default, too short for a busy machine.
configure({ asyncUtilTimeout: 3000 });

afterEach(() => {
  cleanup();
});
