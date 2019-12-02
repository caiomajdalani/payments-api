'use strict'

const md5 = require('md5')
    , sha256 = require('sha256')
    , uuid = require('uuid')
    , { API_SECRET_KEY, API } = process.env
    , _api = JSON.parse(API)

const toSHA256 = (string) => {

    return sha256(`${string}${_api.SECRET}`)
}

const toMD5 = (string) => {

    return md5(`${string}${_api.SECRET}`)
}

const token = () => {
    const codes = []

    for (let index = 1; index <= 10; index++) {
        codes.push(`[${uuid()}]`)
    }

    return { codes }
}

module.exports = {
    toSHA256: (string) => {
        return toSHA256(string)
    },
    toMD5: (string) => {
        return toMD5(string)
    },
    isEqualSHA256: (firstString, secondString) => {
        return (toSHA256(firstString) === toSHA256(secondString))
    },
    generateMultipleTokens: () => {

        const { codes } = token()

        return codes

    },
    generateSingleToken: () => {
        return `[${uuid()}]`
    },
    isEqualMD5: (firstString, secondString) => {
        return (toMD5(firstString) === toMD5(secondString))
    },
    toObjectId: ({ mongoose }) => id => (mongoose.Types.ObjectId(id)),
    toUUID: () => (md5(uuid())),
    toSecret: () => (sha256(uuid())),
    toRandom: (precision = 4) => Math.floor(Math.random() * 9999).toPrecision(precision).toString().replace('.', '')
}