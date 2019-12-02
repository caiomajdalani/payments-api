'use strict'

module.exports = {

    disconnect: (reason, callback) => ({ mongoose }) => {
        mongoose.connection.close(() => {
            console.info(`[*] MONGODB DISCONNECTED`)
            console.warn(reason)
            callback()
        })
    },

    connect: ({ URI, OPTIONS, ENVIRONMENT, TIME }) => ({ mongoose, bluebird }) => {

        mongoose.Promise = bluebird

        mongoose.set(`debug`, true)

        mongoose.connect(URI, OPTIONS)

        mongoose.connection.on(`connected`, () => {
            console.info(`[*] MONGODB GET CONNECTED IN ${ENVIRONMENT} MODE`)
        })

        mongoose.connection.on(`error`, (error) => {
            console.debug(`[*] MONGODB GOT AN ERROR WHEN WAS TRYING TO GET CONNECTED IN ${ENVIRONMENT} MODE`)
            console.error(`[*] REASON => `, error)
        })

        mongoose.connection.on(`disconnected`, () => {
            console.info(`[*] MONGODB DISCONNECTED AT ${TIME}`)
        })
    }

}
