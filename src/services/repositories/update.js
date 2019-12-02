'use strict'

module.exports = (schemas, query, object) => {

    return schemas.model.findOneAndUpdate(query, { $set: object }, { new: true }).then(data => { return { data } }).catch(error => { return { error } })

}