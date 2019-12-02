'use strict'

module.exports = ({ router, services, schemas }) => ({ controllers, passport, moment, joi }) => {

    router
        .route('/payments')
        .post([services.validations.verify({ services, moment, joi }, `payment`, `create`), controllers.payments.create({ services, schemas, moment })])
        .get([services.validations.verify({ services, moment, joi }, `payment`, `findAll`), controllers.payments.findAll({ services, schemas, moment })])

    router
        .route('/payments/:payment')
        .get([services.validations.verify({ services, moment, joi }, `payment`, `findOne`), controllers.payments.findOne({ services, schemas, moment })])

    return router
}