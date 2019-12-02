'use strict'

const middlewares = require('./middlewares/index')
    , configurations = require('./configurations/index')

async function startApplicationAsync() {
    middlewares.databases.mongodb.connect(configurations.databases.mongodb)(configurations.dependencies)
    await middlewares.servers.express.start(configurations.servers.express)(configurations.dependencies)
}

startApplicationAsync()
