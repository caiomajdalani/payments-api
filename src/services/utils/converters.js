'use strict'

const mongoose = require('mongoose')

module.exports = {
    toObjectId: string => mongoose.Types.ObjectId(string),
    toBufferDecode: data => JSON.parse(data),
    toBufferEncode: data => Buffer.from(JSON.stringify(data))
}