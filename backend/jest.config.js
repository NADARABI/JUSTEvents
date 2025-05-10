export default {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
