'use strict'

module.exports = (schemas, query, object) => {

    return schemas.model.update(query, { $set: object }, { multi: true, new: true }).then(data => { return { data } }).catch(error => { return { error } })

}
