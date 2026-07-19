import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
    },
  },
]);
