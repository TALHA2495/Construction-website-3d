import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    /* Unit tests live next to sources; e2e/ holds Playwright specs, which
       must never be collected by Vitest (test.describe collision). */
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**", "e2e/**"],
    environment: "node",
    passWithNoTests: true,
  },
});
