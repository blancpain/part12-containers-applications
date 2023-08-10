module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    "vitest-globals/env": true,
    "cypress/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:vitest/recommended",
    "plugin:vitest-globals/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "vitest", "cypress"],
  rules: {
    "react-refresh/only-export-components": "warn",
    "react/prop-types": 0,
  },
};
