module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\.tsx?$': 'ts-jest',
  },
};