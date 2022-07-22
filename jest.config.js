const nextJest = require('next/jest');

// https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/tests'],
};

module.exports = createJestConfig(customJestConfig);
