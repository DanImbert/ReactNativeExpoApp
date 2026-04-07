module.exports = {
  preset: 'jest-expo',
  clearMocks: true,
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};
