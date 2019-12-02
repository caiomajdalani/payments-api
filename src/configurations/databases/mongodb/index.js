'use strict'

const { ENVIRONMENT, MONGODB } = process.env

const _mongodb = JSON.parse(MONGODB)

module.exports = {

    OPTIONS: {
        autoIndex: _mongodb.INDEX,
        ssl: _mongodb.SSL,
        poolSize: _mongodb.POOLS,
        autoReconnect: _mongodb.RECONNECT,
        reconnectTries: _mongodb.TRIES,
        replicaSet: _mongodb.REPLICA,
        useNewUrlParser: true
    },
    URI: _mongodb.URI,
    TIME: new Date(),
    ENVIRONMENT

}