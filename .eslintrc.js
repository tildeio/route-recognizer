module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "simple-import-sort", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  rules: {
    "sort-imports": "off",
    "import/order": "off",
    "import/no-extraneous-dependencies": "error",
    "import/no-unassigned-import": "error",
    "import/no-duplicates": "error",
    "import/no-unresolved": "off",
    "simple-import-sort/sort": "error"
  },
  ignorePatterns: ["dist/", "node_modules/", "DEBUG/", "*.d.ts"],
  overrides: [
    {
      files: ["lib/**/*.ts", "tests/*.ts"],
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module"
      },
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      ],
      rules: {
        "@typescript-eslint/no-use-before-define": [
          "error",
          { functions: false }
        ],
        "@typescript-eslint/prefer-includes": "off",
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          { allowExpressions: true }
        ]
      }
    }
  ]
};
