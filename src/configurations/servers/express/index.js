'use strict'

const { ENVIRONMENT, API, PORT } = process.env

module.exports = {

    ENVIRONMENT,
    API: API ? JSON.parse(API) : null,
    PORT: PORT ? JSON.parse(PORT) : null
}
