module.exports = {
  semi: true,
  trailingComma: "es5",
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  bracketSpacing: true,
  endOfLine: "auto",
  plugins: [require("prettier-plugin-tailwindcss")],
  overrides: [
    {
      files: "*.test.ts",
      options: {
        printWidth: 150,
      },
    },
  ],
};
