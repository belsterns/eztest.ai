module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};