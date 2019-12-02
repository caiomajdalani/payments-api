'use strict'

module.exports = {

    express: require('express'),
    http: require('http'),
    https: require('https'),
    mongoose: require('mongoose'),
    bluebird: require('bluebird'),
    passport: require('passport'),
    jsonwebtoken: require('jsonwebtoken'),
    jwt: require('passport-jwt'),
    parser: require('body-parser'),
    cors: require('cors'),
    timeout: require('connect-timeout'),
    helmet: require('helmet'),
    errors: require('http-errors'),
    compression: require('compression'),
    limit: require('express-rate-limit'),
    spdy: require('spdy'),
    path: require('path'),
    currency: require('currency-formatter'),
    fs: require('fs'),
    requestId: require('express-request-id')(),
    moment: require('moment-timezone'),
    joi: require('joi'),
    swagger: require(`express-swagger-generator`),
    schemas: require('../../models/index'),
    middlewares: require('../../middlewares/index'),
    databases: require('../databases/index'),
    services: require('../../services/index'),
    routes: require('../../routes/index'),
    controllers: require('../../controllers/index')

}