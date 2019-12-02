module.exports = {
    verbose: true,
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/coverage/",
        "jest.config.js"
    ],
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx}"
    ]
}