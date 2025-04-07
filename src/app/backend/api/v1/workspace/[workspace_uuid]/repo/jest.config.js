module.exports = {
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\.|/)(test|spec))\.jsx?$',
  transform: {
    '^.+\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};