/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 15 * 1_000,
  modulePathIgnorePatterns: ["<rootDir>/e2e-tests/"],
  /*setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],*/
};
