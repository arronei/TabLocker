export default {
  // stylelint-config-prettier is skipped: Stylelint 16+ already dropped all
  // formatting/stylistic rules from core, so there's nothing left for it to disable.
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**", "node_modules/**", "coverage/**", "dashboards/**"],
  plugins: ["stylelint-order"],
  rules: {
    "alpha-value-notation": "number",
    "color-function-notation": "modern",
    "custom-property-pattern": "^[a-z][-_a-zA-Z0-9]+$",
    "hue-degree-notation": "number",
    "order/order": ["custom-properties", "declarations"],
    "order/properties-alphabetical-order": true,
    "property-no-vendor-prefix": [true, { ignoreProperties: ["appearance", "text-size-adjust"] }],
    "selector-class-pattern": "^[a-z][-a-zA-Z0-9]+$",
    "selector-no-vendor-prefix": [
      true,
      { ignoreSelectors: ["::-webkit-input-placeholder", "/-moz-.*/"] },
    ],
    "value-no-vendor-prefix": [true, { ignoreValues: ["box", "fit-content", "inline-box"] }],
  },
};
