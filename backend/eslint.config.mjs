import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  { ignores: ["eslint.config.mjs", "src/generated/**"] },
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: "commonjs",
    },
  },
  {
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
];
