'use strict'

module.exports = (schemas, object) => {

    return new schemas.model(object).save().then(data => { return { data } }).catch(error => { return { error } })

}