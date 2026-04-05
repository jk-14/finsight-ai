// @ts-check
import coreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...coreWebVitals,
  prettier,
  {
    rules: {
      "no-console": ["error", { allow: ["error"] }],
      "react-hooks/exhaustive-deps": "warn",
      // SVG icons/logos don't benefit from Next.js image optimization
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // Seed script is a CLI tool — console output is intentional
    files: ["scripts/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
];

export default config;
