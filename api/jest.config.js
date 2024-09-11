export default {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testMatch: [
        '**/__tests__/**/*.js?(x)',
        '**/?(*.)+(spec|test).js?(x)',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/index.js',
    ],
    coverageDirectory: 'coverage',
};
