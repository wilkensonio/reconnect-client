// Jest configuration

module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
     "\\.(css|scss)$": "identity-obj-proxy"
  },
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
};

