const middlewares = require('../middlewares/index')
// const mongoose = require('../configurations/dependencies/index').mongoose
// const bluebird = require('../configurations/dependencies/index').bluebird
const dependencies = require('../configurations/dependencies/index')

const mockMongodb = {
    OPTIONS: {
        autoIndex: true,
        ssl: false,
        useNewUrlParser: true
    },
    URI: 'mongodb://caiomajdalani:abc123@ds351428.mlab.com:51428/payments-api',
    TIME: new Date(),
    ENVIRONMENT: 'UnitTest'
}

describe('Middlewares', ()=>{
    
})