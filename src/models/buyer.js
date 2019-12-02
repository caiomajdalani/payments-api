'use strict'


module.exports = ({ mongoose }) => {

    let _schema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        cpf: {
            type: String,
            required: true
        }
    })

    return {
        entity: _schema,
        model: mongoose.model('buyer', _schema)
    }
}

