'use strict'

/**
 * Configurações de variáveis e dependências de projeto
 */

// SuperTest é o framework que iremos utilizar para fazer as requisições HTTP dos scripts automatizados, ou seja, 
// é ele quem "simula" o comportamento do POSTMAN, por exemplo, no entanto de forma automatizada.
const supertest = require("supertest")
    // Chai é o framwork utilizado para fazer as asserções do resultado "esperado" e "atual". Por exemplo, 
    // iremos utilizar algo como "expect(res.body.message).to.equal(`OK`)", o que significa que, se não vier uma string
    // com "OK" dentro da propriedade "message" do corpo de resposta, o teste irá falhar.
    , expect = require("chai").expect
    , assert = require(`chai`).assert
    // addContext é um addon do framework "mochawesome", que gera relatórios dos scripts automatizados 
    , addContext = require('mochawesome/addContext')
    // o método "supertest()" é para caso você queira setar uma URL base de teste
    , request = supertest("http://localhost:5000/")
    // faker é um módulo do node para gerarmos massa de dados aleatórios
    , faker = require('faker')

/**
 * Método para adicionar ao relatório os dados utilizados para a Request e o Response da requisição
 * @param {*} test Parâmetro de referência ao caso de teste específico
 * @param {*} method Método HTTP utilizado (Ex.: get, post, etc)
 * @param {*} url Rota utilizada para a chamada HTTP
 * @param {*} headers Headers adicionais da requisição (Ex.: Authorization, etc)
 * @param {*} body Corpo da requisição, se houver
 * @param {*} httpCode Código HTTP de retorno esperado
 * @param {*} response Corpo da resposta da API
 */

const reporter = function (test, method, url, headers = {}, body = {}, httpCode = 201, response) {
    return addContext(test, {
        title: 'Request Parameters',
        value: {
            URL: `http://localhost:5000/${url}`,
            Method: method,
            Headers: headers,
            Body: body,
            HttpCodeExpect: httpCode,
            Response: response
        }
    })
}

/**
 * Método para montar e realizar a requisição HTTP
 * @param {*} method Método HTTP a ser utilizado (Ex.: get, post, etc)
 * @param {*} url Rota que a chamada deverá ser realizada
 * @param {*} headers Headers adicionais da requisição (Ex.: Authorization, etc)
 * @param {*} body Corpo da requisição, se houver
 * @param {*} httpCode Código HTTP de retorno esperado
 */

const http = function (method, url, headers = {}, body = {}, httpCode = 201) {
    return request[method](url)
        .set(headers)
        .send(body)
        .expect(httpCode)
}

/**
 * Método para retornar o corpo do POST mapeado com dados aleatórios
 * @param {*} type Paramêtro para validar qual o tipo de pagamento
 */
const _mapBody = (type) => {
    return {
        buyer: {
            name: faker.name.findName(),
            email: faker.internet.email(),
            cpf: faker.helpers.replaceSymbolWithNumber("###########")
        },
        date: faker.date.recent(15),
        payment: {
            amount: faker.random.number({ min: 1000, max: 10000 }),
            type: type,
            card: type === 'credit' ? {
                brand: 'visa',
                owner: faker.name.findName(),
                number: faker.helpers.replaceSymbolWithNumber("################"),
                expiration: '01/2022',
                bin: faker.helpers.replaceSymbolWithNumber("###")
            } : null
        }
    }
}

/**
 * Definição de Suítes e Casos de Teste
 * describe - Suíte de Teste
 * it - Caso de Teste
 */

describe('Test Mocha with Functional NodeJS', () => {
    it(`GET`, function (done) {
        var test = this
        http('get', 'payments', {}, {}, 200)
            .end((err, res) => {
                expect(res.body.message).to.equal(`OK`)
                reporter(test, 'get', 'payments', {}, {}, 200, (res ? res.body : err))
                done(err)
            })
    }),
        it(`POST - Boleto`, function (done) {
            var test = this
                , body = _mapBody('boleto')
            http('post', 'payments', {}, body, 201)
                .end((err, res) => {
                    reporter(test, 'get', 'payments', {}, body, 201, (res ? res.body : err))
                    done(err)
                })
        }),
        it(`POST - Credit`, function (done) {
            var test = this
                , body = _mapBody('credit')
            http('post', 'payments', {}, body, 201)
                .end((err, res) => {
                    reporter(test, 'get', 'payments', {}, body, 201, (res ? res.body : err))
                    done(err)
                })
        })
})