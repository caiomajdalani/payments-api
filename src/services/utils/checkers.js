'use strict'

const removeNonNumbers = value => value.replace(/[^\d]+/g, '')

const _validateCPF = cpf => {

    let numeros, digitos, soma, i, resultado, digitos_iguais

    digitos_iguais = 1

    if (cpf.length < 11)
        return false
    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            digitos_iguais = 0
            break
        }
    if (!digitos_iguais) {
        numeros = cpf.substring(0, 9)
        digitos = cpf.substring(9)
        soma = 0
        for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
        if (resultado != digitos.charAt(0))
            return false
        numeros = cpf.substring(0, 10)
        soma = 0
        for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
        if (resultado != digitos.charAt(1))
            return false
        return true
    }
    else
        return false
}

const _isCPF = cpf => _validateCPF(cpf)
    , _isEmail = email => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    , _isNumber = numbers => (/[1-9]/g.test(numbers))
    , _isCharacter = character => (/^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/.test(character))

module.exports = {
    isEmail: _isEmail,
    isCPF: _isCPF,
    isNumber: _isNumber,
    isCharacter: _isCharacter,
    isBirthdate: ({ moment }) => value => {
        if (removeNonNumbers(value).length !== 8) {
            return false
        }
        const date = moment(value, undefined, true)
        const minimum = moment().subtract(18, 'years')
        return (
            date.isValid() &&
            date.isAfter('1905-12-31') &&
            date.isBefore(minimum)
        )
    },
    isValidSchedule: ({ moment }) => value => {
        const minimum = moment()
        const date = moment(value, undefined, true)
        return (date.isValid() && date.isAfter(minimum))
    },
    isValidDate: ({ moment }) => value => {
        const date = moment(value, undefined, true)
        return date.isValid()
    }
}