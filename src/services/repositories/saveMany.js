'use strict'

module.exports = (schemas, object) => {

    return schemas.model.collection.insert(object).then(data => { return { data } }).catch(error => { return { error } })

}