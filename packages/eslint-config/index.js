module.exports = {
  extends: ["react-app", "plugin:prettier/recommended"],
  plugins: ['prettier', 'import'],
  rules: {
    "react/jsx-key": ['error', { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true },
    "@typescript-eslint/no-explicit-any": 'error',
    "import/newline-after-import": ['error', { "count": 1 }],
    "no-unused-vars": 'off',
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": true,
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
  }
}
