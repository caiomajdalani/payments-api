'use strict'

const _validate = (services, schemas, moment) => async (body) => {
    const isCPF = await services.checkers.isCPF(body.buyer.cpf)
    if (!isCPF) {
        return { result: false, message: 'This CPF is not valid.' }
    }
    const isDate = await services.checkers.isValidDate(body.date)
    if (!isDate) {
        return { result: false, message: 'This Date is not valid.' }
    }
    return { result: true }
}

const _mapPayment = (services, schemas, moment) => (body, buyer) => {
    return {
        buyer: buyer._id,
        date: +moment(body.date),
        payment: {
            amount: body.payment.amount,
            type: body.payment.type,
            card: body.payment.type === "credit" ? {
                brand: body.payment.card.brand,
                owner: body.payment.card.owner,
                number: body.payment.card.number,
                expiration: body.payment.card.expiration,
                bin: body.payment.card.bin
            } : null
        }
    }
}

const _query = (request) => {

    let query = {}
    let { cpf, name, email, initialDate, finalDate } = request.query

    query = cpf ? Object.assign({}, query, { cpf: { '$regex': decodeURIComponent(cpf), '$options': 'i' } }) : query
    query = name ? Object.assign({}, query, { name: { '$regex': decodeURIComponent(name), '$options': 'i' } }) : query
    query = email ? Object.assign({}, query, { email: { '$regex': decodeURIComponent(email), '$options': 'i' } }) : query
    query = initialDate ? Object.assign({}, query, { initialDate: { '$regex': decodeURIComponent(initialDate), '$options': 'i' } }) : query
    query = finalDate ? Object.assign({}, query, { finalDate: { '$regex': decodeURIComponent(finalDate), '$options': 'i' } }) : query

    return query
}

module.exports = {

/**
 * @typedef createPayment
 * @property {buyer.model} buyer.required
 * @property {string} date.required - Payment date
 * @property {payment.model} payment.required
 */

/**
 * @typedef buyer
 * @property {string} name.required - Buyer name
 * @property {string} email.required - Buyer email
 * @property {string} cpf.required - Buyer CPF
 */

/**
 * @typedef payment
 * @property {integer} amount.required - Amount paid on cents (Ex.: R$22,50 = 2250)
 * @property {string} type.required - Payment type ('credit' or 'boleto')
 * @property {card.model} card - Payment card informations (Required when "type" is credit)
 */

/**
 * @typedef card
 * @property {string} brand.required - Card brand
 * @property {string} owner.required - Name of the card owner
 * @property {string} number.required - Card number
 * @property {string} expiration.required - Card expiration date (Ex.: 12/2028)
 * @property {string} bin.required - Card bin
 */

/**
 * @typedef responsePayment
 * @property {string} id.required - Payment`s Id (MongoDB objectId)
 * @property {buyer.model} buyer.required
 * @property {string} date.required - Payment date
 * @property {payment.model} payment.required
 */

/**
 * @typedef Errors
 * @property {integer} code - Error business code
 * @property {string} message - Error message
 */

/**
 * Create a Payment
 * @route POST /payments
 * @group PAYMENTS - Resource for payments operations.
 * @param {createPayment.model} createPayment.body.required - Create Payment payload.
 * @param {token} Authorization.header - Bearer TOKEN for authorization
 * @returns {responsePayment.model} 201 - Payment object with it properties.
 * @returns {Errors.model} 400 - Invalid properties.
 * { code: 001,  message: "Buyer is required." } 
 * { code: 002,  message: "Name is required and must have at least a name and surname." }
 * { code: 003,  message: "Email is required and must be a valid one." }
 * { code: 004,  message: "CPF is required and must have 11 characters." }
 * @returns {Error} 401 - Unauthorized.
 * @returns {Errors.model} 409 - Business error.
 * { code: 005,  message: "CPF is not a valid Brazilian CPF." } 
 * { code: 006,  message: "When type is 'credit', Card is required." }
 * { code: 007,  message: "Transaction not allowed." }
 * @returns {Error} 422 - UnprocessableEntity
 * @returns {Error} 500 - Internal server error.
 */
    create: ({ services, schemas, moment }) => async (request, response) => {
        try {
            const res = await _validate(services, schemas, moment)(request.body)
            if (!res.result) {
                return services.replies.conflict(response)(res.message)
            }
            const { data: dataFindBuyer, error: errorFindBuyer } = await services.repositories.findOne(schemas.buyer, { "cpf": request.body.buyer.cpf })

            let _mappedPayment

            if (dataFindBuyer) {
                _mappedPayment = await _mapPayment(services, schemas, moment)(request.body, dataFindBuyer)
            } else {
                const buyer = await services.repositories.save(schemas.buyer, request.body.buyer)
                _mappedPayment = await _mapPayment(services, schemas, moment)(request.body, buyer.data)
            }

            const { data: dataCreatePayment, error: errorCreatePayment } = await services.repositories.save(schemas.payment, _mappedPayment)
            if (dataCreatePayment) {
                const { data: dataFindPayment, error: errorFindPayment } = await services.repositories.findOne(schemas.payment, { _id: dataCreatePayment._id }, 'buyer')
                return services.replies.created(response)(dataFindPayment)
            } else {
                return services.replies.unprocessableEntity(response)(errorCreatePayment)
            }
        } catch (error) {
            console.log(`error => `, error)
            return services.replies.internalServerError(response)(`Error.`)
        }
    },

/**
 * Find a Payment
 * @route GET /payments/{paymentId}
 * @group PAYMENTS - Resource for payments operations.
 * @param {token} Authorization.header - Bearer TOKEN for authorization
 * @param {string} paymentId.path.required - Payment ID
 * @returns {responsePayment.model} 200 - Payment object with it properties.
 * @returns {Errors.model} 400 - Invalid properties.
 * { code: 008,  message: "Payment is invalid." }
 * @returns {Error} 401 - Unauthorized.
 * @returns {Errors.model} 404 - Not found.
 * { code: 009,  message: "Payment not found." }
 * @returns {Error} 500 - Internal server error.
 */
    findOne: ({ services, schemas, moment }) => async (request, response) => {
        try {
            const { data: dataFindPayment, error: errorFindPayment } = await services.repositories.findOne(schemas.payment, { _id: request.params.paymentId }, 'buyer')
            if (dataFindPayment) {
                return services.replies.ok(response)(dataFindPayment)
            } else {
                return services.replies.notFound(response)({ resource: services.constants.payment.NOT_FOUND, message: `Payment ${request.params.id} not found.` })
            }
        } catch (error) {
            console.log(`error => `, error)
            return services.replies.internalServerError(response)(`Error.`)
        }
    },

/**
 * Find Payments
 * @route GET /payments
 * @group PAYMENTS - Resource for payments operations.
 * @param {token} Authorization.header - Bearer TOKEN for authorization
 * @param {string} cpf.query - Filter for Buyer CPF
 * @param {string} name.query - Filter for Buyer Name
 * @param {string} email.query - Filter for Buyer Email
 * @param {dateTime} initialDate.query - Filter for initial Date
 * @param {dateTime} finalDate.query - Filter for final Date
 * @returns {Array.<responsePayment>} 200 - Array of payments objects with their properties.
 * @returns {Errors.model} 400 - Invalid properties.
 * { code: 009,  message: "CPF is invalid." } 
 * { code: 010,  message: "Name must have at least a name and surname." }
 * { code: 011,  message: "Email must be a valid one." }
 * { code: 012,  message: "Initial date is invalid." }
 * { code: 013,  message: "Final date is invalid." }
 * @returns {Error} 401 - Unauthorized.
 * @returns {Error} 500 - Internal server error.
 */
    findAll: ({ services, schemas, moment }) => async (request, response) => {
        try {
            const query = _query(request)
            console.log(query)
            const { data: dataFindPayments, error: errorFindPayments } = await services.repositories.find(schemas.payment, {}, 0, 999, 'buyer')
            return services.replies.ok(response)(dataFindPayments)
        } catch (error) {
            console.log(`error => `, error)
            return services.replies.internalServerError(response)(`Error.`)
        }
    }
}