module.exports = {
  moduleDirectories: ['node_modules'],
  setupTestFrameworkScriptFile: '<rootDir>/testsSetup.js',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
