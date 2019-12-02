'use strict'

const CODES = {
    ok: 200,
    created: 201,
    accepted: 202,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
    conflict: 409,
    unprocessableEntity: 422,
    internalServerError: 500
}

module.exports = {

    ok: response => (data) => response.status(CODES.ok).json({
        status: CODES.ok,
        message: `OK`,
        result: data
    }),
    created: response => (data) => response.status(CODES.created).json({
        status: CODES.created,
        message: `CREATED`,
        result: data
    }),
    accepted: response => (data) => response.status(CODES.accepted).json({
        status: CODES.accepted,
        message: `ACCEPTED`,
        result: data
    }),
    badRequest: response => (data) => response.status(CODES.badRequest).json({
        status: CODES.badRequest,
        message: `BADREQUEST`,
        result: data
    }),
    unauthorized: response => (data) => response.status(CODES.unauthorized).json({
        status: CODES.unauthorized,
        message: `UNAUTHORIZED`,
        result: data
    }),
    notFound: response => (data) => response.status(CODES.notFound).json({
        status: CODES.notFound,
        message: `NOTFOUND`,
        result: data
    }),
    conflict: response => (data) => response.status(CODES.conflict).json({
        status: CODES.conflict,
        message: `CONFLICT`,
        result: data
    }),
    unprocessableEntity: response => (data) => response.status(CODES.unprocessableEntity).json({
        status: CODES.unprocessableEntity,
        message: `UNPROCESSABLE`,
        result: data
    }),
    internalServerError: response => (data) => response.status(CODES.internalServerError).json({
        status: CODES.internalServerError,
        message: `ERROR`,
        result: data
    })

}