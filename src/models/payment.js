'use strict'


module.exports = ({ mongoose }) => {

    let _schema = new mongoose.Schema({
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyer'
        },
        payment: {
            amount: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                default: 'money',
                enum: [
                    'credit',
                    'boleto'
                ]
            },
            card: {
                brand: {
                    type: String
                },
                owner: {
                    type: String
                },
                number: {
                    type: String
                },
                expiration: {
                    type: String
                },
                bin: {
                    type: String
                }
            },
        },
        date: {
            type: Number,
            default: 0
        }
    })

    return {
        entity: _schema,
        model: mongoose.model('payment', _schema)
    }
}

