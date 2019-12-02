'use strict'

module.exports = (schemas, query = {}, populate = '') => {

    return schemas.model.findOne(query).populate(populate).lean().then(data => { return { data } }).catch(error => { return { error } })

}