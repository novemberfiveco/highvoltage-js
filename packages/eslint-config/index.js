module.exports = {
  extends: ["react-app", "plugin:prettier/recommended"],
  plugins: ['prettier', 'import', 'simple-import-sort'],
  rules: {
    "react/jsx-key": 'error',
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
    "simple-import-sort/sort": [
      "warn",
      {
        "groups": [
          ["^\\u0000|^react$"],
          ["^@?\\w"],
          ["^config"],
          ["^[^.]"],
          ["^assets"],
          ["^packages"],
          ["^utils"],
          ["^types|^store|^services|^constants|^hooks|^theme|^connectors"],
          ["^pages"],
          ["^components"],
          ["^\\."]
        ]
      }
    ]
  }
}
