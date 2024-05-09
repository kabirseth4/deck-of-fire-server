import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/server/__tests__/helpers/test.setup.ts"],
  modulePathIgnorePatterns: ["dist", "helpers"],
  transform: {},
};
export default config;
