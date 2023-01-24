/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],

  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 85,
      statements: 0
    }
  },
  moduleDirectories: ["node_modules", "src"],
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"]
};
