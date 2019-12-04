module.exports = {
    verbose: true,
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/coverage/",
        "jest.config.js",
        '/src/services/repositories/'
    ],
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx}"
    ]
}