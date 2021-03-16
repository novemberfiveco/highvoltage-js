module.exports = {
  extends: ["react-app", "plugin:prettier/recommended", "plugin:jest/recommended", "plugin:jest/style", "plugin:testing-library/react", "plugin:jest-dom/recommended"],
  plugins: ['prettier', 'import', 'simple-import-sort'],
  rules: {
    "react/jsx-key": 'error',
    "@typescript-eslint/no-explicit-any": 'error',
    "@typescript-eslint/no-empty-interface": "error",
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
    ],
    "@typescript-eslint/no-empty-interface": [
      "error",
      {
        "allowSingleExtends": false
      }
    ],
    "@typescript-eslint/array-type": [
      "error"
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-non-null-assertion": ["warn"]
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": ["warn"]
      }
    }
  ]
}
