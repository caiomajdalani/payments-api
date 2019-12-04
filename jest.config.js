module.exports = {
    verbose: true,
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/coverage/",
        "jest.config.js",
        '/src/services/repositories/',
        '/src/middlewares/authenticators/',
        '/src/middlewares/databases/mongodb/index.js'
    ],
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx}"
    ]
}