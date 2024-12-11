import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', 
    coverage: {
      provider: 'v8', 
      reporter: ['text', 'json', 'lcov'], 
      all: true, 
      include: ['src/**/*.ts'], 
      exclude: ['src/**/*.d.ts'], 
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});
