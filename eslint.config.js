import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import headers from "eslint-plugin-headers";
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
      camelcase: "error",
      complexity: ["warn", { max: 30 }],
      curly: "error",
      "default-case": "error",
      "default-case-last": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "func-style": ["error", "expression"],
      "max-depth": ["error", 5],
      "no-await-in-loop": "error",
      "no-case-declarations": "error",
      "no-duplicate-imports": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "no-multi-assign": "error",
      "no-param-reassign": "error",
      "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
      "no-regex-spaces": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unassigned-vars": "error",
      "no-underscore-dangle": "error",
      "no-unneeded-ternary": "error",
      "no-use-before-define": "error",
      "no-useless-assignment": "error",
      "no-useless-concat": "error",
      "no-var": "error",
      "one-var": ["error", "never"],
      "perfectionist/sort-imports": [
        "error",
        {
          groups: ["external", ["parent", "sibling", "index"]],
          newlinesBetween: 1,
          order: "asc",
          type: "natural",
        },
      ],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false, allowUnboundThis: true }],
      "prefer-const": ["error", { destructuring: "all", ignoreReadBeforeAssign: false }],
      "prefer-object-has-own": "error",
      "prefer-template": "error",
      "require-await": "error",
      "sort-keys": ["error", "asc", { caseSensitive: true, natural: false }],
      "sort-vars": "error",
      "vars-on-top": "error",
    },
  },
  {
    files: ["build.js", "src/**/*.ts"],
    plugins: { headers },
    rules: {
      "headers/header-format": [
        "error",
        {
          content: "Copyright (C) {company}. Licensed under the MIT License.",
          source: "string",
          style: "line",
          trailingNewlines: 2,
          variables: { company: "Arron Eicholz" },
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
