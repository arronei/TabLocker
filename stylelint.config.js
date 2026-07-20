export default {
  // stylelint-config-prettier is skipped: Stylelint 16+ already dropped all
  // formatting/stylistic rules from core, so there's nothing left for it to disable.
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**", "node_modules/**", "coverage/**", "dashboards/**"],
};
