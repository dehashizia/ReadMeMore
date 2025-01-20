// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Chemin vers votre application Next.js
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironmentOptions: {
    customExportConditions: [""], // Pour Next.js 13+
  },
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
};

module.exports = createJestConfig(customJestConfig);
