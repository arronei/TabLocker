import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "coverage/**", "dashboards/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  perfectionist.configs["recommended-natural"],
  prettierConfig,
  {
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          groups: ["external", ["parent", "sibling", "index"]],
          newlinesBetween: 1,
          order: "asc",
          type: "natural",
        },
      ],
    },
  },
  {
    files: ["build.js"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.webextensions },
    },
  },
);
