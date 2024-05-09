import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/src/server/__tests__/helpers/test.setup.js"],
  modulePathIgnorePatterns: ["dist", "helpers"],
  transform: {},
};
export default config;
