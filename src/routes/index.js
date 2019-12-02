'use strict'

const _paths = [
    `./payments`
]

module.exports = utils => dependencies => _paths.map(path => require(path)(utils)(dependencies))

