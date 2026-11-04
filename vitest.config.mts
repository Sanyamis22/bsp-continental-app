import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: { JWT_SECRET: "unit-test-jwt-secret-0123456789abcdef0123", NEXTAUTH_SECRET: "unit-test-nextauth-secret-0123456789" },
  },
});
