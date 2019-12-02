'use strict'

const { ENVIRONMENT, API, PORT } = process.env

module.exports = {

    ENVIRONMENT,
    API: JSON.parse(API),
    PORT: JSON.parse(PORT)
}
