'use strict'

module.exports = ({ services, moment, joi }, entity, method) => async (request, response, next) => {

    const { value: dataValidation, error: errorValidation } = services.validations[entity][method]({ joi }).unknown().validate(request)

    if (errorValidation) {
        return services.replies.badRequest(response)({ resource: services.constants[entity].INVALID, message: errorValidation.message })
    }

    next()
}