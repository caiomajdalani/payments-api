'use strict'

const { ENVIRONMENT, MONGODB } = process.env

const _mongodb = MONGODB ? JSON.parse(MONGODB) : null

module.exports = {

    OPTIONS: _mongodb ? {
        autoIndex: _mongodb.INDEX,
        ssl: _mongodb.SSL,
        poolSize: _mongodb.POOLS,
        // autoReconnect: _mongodb.RECONNECT,
        // reconnectTries: _mongodb.TRIES,
        replicaSet: _mongodb.REPLICA,
        useNewUrlParser: true,
        useUnifiedTopology: true
    } : null,
    URI: _mongodb ? _mongodb.URI : null,
    TIME: new Date(),
    ENVIRONMENT

}