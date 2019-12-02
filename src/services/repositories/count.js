'use strict'

module.exports = (schemas, query = {}) => {

    return schemas.model.count(query).lean().then(data => { return { data } }).catch(error => { return { error } })

}