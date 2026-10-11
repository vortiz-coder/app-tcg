module.exports = {
  projects: [
    { displayName: "app", preset: "jest-expo", testPathIgnorePatterns: ["/node_modules/", "no-literal-strings"] },
    // Tooling test: plain Node, no Expo runtime globals.
    { displayName: "i18n-lint", testEnvironment: "node", testMatch: ["<rootDir>/__tests__/no-literal-strings.test.js"], transform: {} },
  ],
};
