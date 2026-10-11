// FND-05: UI text must come from i18n (apps/mobile/src/i18n/locales), never literal JSX strings.
const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");
const i18next = require("eslint-plugin-i18next");

module.exports = defineConfig([
  {
    ignores: ["**/node_modules/**", "**/.expo/**", "**/dist/**", "spike/**", "Claude outputs/**", "packages/shared/src/database.ts"],
  },
  expo,
  {
    files: ["**/__tests__/**/*.js"],
    languageOptions: {
      globals: { require: "readonly", __dirname: "readonly", process: "readonly", test: "readonly", expect: "readonly" },
    },
  },
  {
    files: ["**/e2e/scripts/**/*.js"], // Maestro runScript globals
    languageOptions: { globals: { http: "readonly", json: "readonly", output: "writable", EMAIL: "readonly" } },
  },
  {
    files: ["apps/mobile/app/**/*.tsx", "apps/mobile/src/**/*.tsx"],
    plugins: { i18next },
    rules: {
      "i18next/no-literal-string": [
        "error",
        {
          mode: "jsx-only",
          // Technical props, not UI text (plugin defaults + route names and e2e test ids).
          "jsx-attributes": { exclude: ["className", "style", "type", "key", "id", "width", "height", "name", "href", "testID", "autoCapitalize", "autoComplete", "keyboardType"] },
          "object-properties": { exclude: ["[A-Z_-]+", "testID", "tabBarButtonTestID"] },
        },
      ],
    },
  },
]);
