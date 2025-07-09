module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/spec/**/*-spec.js'],
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/index.js'
  ],
  coverageDirectory: 'coverage',
  testTimeout: 10000
};