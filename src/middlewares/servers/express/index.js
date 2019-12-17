'use strict'

const _docs = ({ swagger, _api, ENVIRONMENT }) => {

    const host = `localhost:5000`

    const schemes = ENVIRONMENT === `LOCAL` ? [`http`] : [`https`]

    swagger(_api)({
        swaggerDefinition: {
            info: {
                description: 'POC for Payments',
                title: 'Payments API',
                version: '1.0',
            },
            host: host,
            // basePath: '/v1',
            produces: [
                'application/json'
            ],
            schemes: schemes,
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: ``
                }
            }
        },
        basedir: __dirname,
        files: ['../../../controllers/**/*.js']
    })

}

const _middlewares = ({ API }) => ({ parser: { json, urlencoded }, passport, cors, requestId, helmet, compression, services, moment }) => {
    return [
        json({ limit: API.REQUEST.LIMIT }),
        urlencoded({ extended: API.REQUEST.EXTENDED, limit: API.REQUEST.LIMIT }),
        helmet(),
        cors(),
        compression(),
        // passport.initialize(),
        requestId
    ]
}

// const _authenticators = ({ API }) => ({ passport, jwt, middlewares, services }) => middlewares.authenticators.passport({ API })({ passport, jwt, services })

// const _sslOptions = ({ ENVIRONMENT }) => ({ fs, path }) => {

//     if (ENVIRONMENT === 'PRODUCTION') {
//         return {
//             key: fs.readFileSync(path.join(__dirname, '../../../ssl/production/payparty_com_br.key'), 'utf8'),
//             cert: fs.readFileSync(path.join(__dirname, '../../../ssl/production/payparty_com_br.crt'), 'utf8'),
//             ca: fs.readFileSync(path.join(__dirname, '../../../ssl/production/payparty_com_br.ca-bundle.crt'), 'utf-8')
//         }
//     } else if (ENVIRONMENT === 'STAGE') {
//         return {
//             key: fs.readFileSync(path.join(__dirname, '../../../ssl/staging/private.key'), 'utf8'),
//             cert: fs.readFileSync(path.join(__dirname, '../../../ssl/staging/certificate.crt'), 'utf8'),
//             ca: fs.readFileSync(path.join(__dirname, '../../../ssl/staging/ca_bundle.crt'), 'utf-8')
//         }
//     } else {
//         return {
//             key: fs.readFileSync(path.join(__dirname, '../../../ssl/development/private.key'), 'utf8'),
//             cert: fs.readFileSync(path.join(__dirname, '../../../ssl/development/certificate.crt'), 'utf8'),
//             ca: fs.readFileSync(path.join(__dirname, '../../../ssl/development/ca_bundle.crt'), 'utf-8')
//         }
//     }

// }

const _routers = express => express.Router()

const _upWithoutSSL = ({ ENVIRONMENT, API, PORT }) => async (dependencies) => {

    const { express, routes, limit, services, schemas, swagger, middlewares, databases, mongoose } = dependencies
        , _api = express()

    const _server = _api.listen(PORT.HTTP, () => console.info(`[*] API ${API.VERSION} RUNNING ON PORT ${PORT.HTTP} IN ${ENVIRONMENT} MODE`))

    const _limiter = new limit({
        windowMs: 2 * 60 * 1000,
        max: 20,
        delayMs: 0
    })

    const _utils = { router: _routers(express), limit: _limiter, schemas: schemas, services: services }

    // _authenticators({ API })(dependencies)

    _api.get('/', (request, response) => {
        return response.status(200).json({ status: 'ok' })
    })

    _api.use(_middlewares({ API })(dependencies))

    _docs({ swagger, _api, ENVIRONMENT })

    _api.use(routes(_utils)(dependencies))

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongodb get disconnected on api termination')
            process.exit(0)
        })

        // clearInterval(metricsInterval)

        _server.close((err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }

            process.exit(0)
        })
    })
}

const _setup = ({ ENVIRONMENT, API, PORT }) => async (dependencies) => {

    _upWithoutSSL({ ENVIRONMENT, API, PORT })(dependencies)

    // switch (ENVIRONMENT) {
    //     case 'DEVELOPMENT':
    //         _upWithoutSSL({ ENVIRONMENT, API, PORT })(dependencies)
    //         break;

    //     case 'LOCAL':
    //         _upWithoutSSL({ ENVIRONMENT, API, PORT })(dependencies)
    //         break;

    //     default:
    //         _upWithoutSSL({ ENVIRONMENT, API, PORT })(dependencies)
    //         break;
    // }

}

module.exports = {

    start: ({ ENVIRONMENT, API, PORT }) => async (dependencies) => _setup({ ENVIRONMENT, API, PORT })(dependencies)

}
