'use strict'

const mongoose = require('mongoose')
    , int32 = require(`mongoose-int32`)

module.exports = {
    buyer: require('./buyer')({ mongoose }),
    payment: require('./payment')({ mongoose }),
}