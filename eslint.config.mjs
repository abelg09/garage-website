import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      ".tools/**",
      "node_modules/**",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      "playwright-report/**",
      "test-results/**",
      "public/assets/**"
    ]
  }
];

export default config;
