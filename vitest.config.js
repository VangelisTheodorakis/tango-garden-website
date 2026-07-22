import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // tests/e2e is Playwright's; vitest must not try to run those.
    include: ['tests/unit/**/*.test.js', 'tests/build/**/*.test.js'],
    environment: 'node',
  },
});
