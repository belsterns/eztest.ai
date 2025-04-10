module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};