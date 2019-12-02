'use strict'

module.exports = (schemas, query = {}, skip = 0, take = 999, populate = '', sort = {}) =>
    schemas.model
        .find(query)
        .sort(sort)
        .populate(populate)
        .lean()
        .skip(parseInt(skip))
        .limit(parseInt(take))
        .then(data => ({ data }))
        .catch(error => ({ error }))