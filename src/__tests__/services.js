'use strict'

const services = require('../services/index')
const configurations = require('../configurations/index')
const dependencies = require('../configurations/dependencies/index')

const moment = require('../configurations/dependencies/index').moment
const joi = require('../configurations/dependencies/index').joi

const res = () => {
    return {
        status: ()=>{
            return {
                json: (data)=>{
                    return data
                },
            }
        },
    }
}

describe('Services', () => {
    describe('Utils', () => {
        describe('Checkers', () => {
            describe('isEmail Func', ()=>{
                it('Valid Email', ()=>{
                    expect(services.checkers.isEmail('test@test.com')).toBe(true)
                })
                it('Invalid Email', ()=>{
                    expect(services.checkers.isEmail('testtest.com')).toBe(false)
                })
            })
            describe('isCPF Func', ()=>{
                it('Valid CPF', ()=>{
                    expect(services.checkers.isCPF('04467490523')).toBe(true)
                })
                it('Invalid CPF (Length)', ()=>{
                    expect(services.checkers.isCPF('123')).toBe(false)
                })
                it('Invalid CPF (Identical Numbers)', ()=>{
                    expect(services.checkers.isCPF('00000000000')).toBe(false)
                })
                it('Invalid CPF (First Digit Position)', ()=>{
                    expect(services.checkers.isCPF('12345678919')).toBe(false)
                })
                it('Invalid CPF (Second Digit Position)', ()=>{
                    expect(services.checkers.isCPF('12345678908')).toBe(false)
                })
                it('Invalid CPF (Second Digit Position 2)', ()=>{
                    expect(services.checkers.isCPF('01234567891')).toBe(false)
                })
                
            })
            describe('isNumber Func', ()=>{
                it('Valid Number', ()=>{
                    expect(services.checkers.isNumber(123)).toBe(true)
                })
                it('Valid Number on String', ()=>{
                    expect(services.checkers.isNumber('123')).toBe(true)
                })
                it('Invalid Number', ()=>{
                    expect(services.checkers.isNumber('abc')).toBe(false)
                })
            })
            // describe('isCharacter Func', ()=>{
            //     it('Valid Char', ()=>{
            //         expect(services.checkers.isCharacter('abc')).toBe(true)
            //     })
            //     it('Invalid Char', ()=>{
            //         expect(services.checkers.isCharacter('*_$')).toBe(false)
            //     })
            // })
            describe('isValidAge Func', ()=>{
                it('Over 18', ()=>{
                    expect(services.checkers.isValidAge(dependencies)('1999-01-01')).toBe(true)
                })
                it('Under 18', ()=>{
                    expect(services.checkers.isValidAge(dependencies)('2019-01-01')).toBe(false)
                })
                it('Invalid date length', ()=>{
                    expect(services.checkers.isValidAge(dependencies)('2019-01')).toBe(false)
                })
            })
            describe('isValidSchedule Func', ()=>{
                it('Valid Date for Schedule', ()=>{
                    let date = dependencies.moment({_i: 'YYYY-MM-DD'}).add(1, 'years')
                    expect(services.checkers.isValidSchedule(dependencies)(date)).toBe(true)
                })
                it('Invalid Date for Schedule', ()=>{
                    let date = dependencies.moment({_i: 'YYYY-MM-DD'}).subtract(1, 'years')
                    expect(services.checkers.isValidSchedule(dependencies)(date)).toBe(false)
                })
            })
            describe('isValidDate Func', ()=>{
                it('Valid Date', ()=>{
                    expect(services.checkers.isValidDate(dependencies)('2019-02-02')).toBe(true)
                })
                it('Invalid Date', ()=>{
                    expect(services.checkers.isValidDate(dependencies)('2019-13-02')).toBe(false)
                })
            })
        })
        describe('Converters', () => {
            it('toBufferEncode func', ()=>{
                let buffer = services.converters.toBufferEncode('Testing buffer encode..')
                expect(Buffer.isBuffer(buffer)).toBe(true)
            })
            // it('toBufferDecode func', ()=>{
            //     expect(services.converters.toBufferDecode(buffer)).toBe('Testing buffer encode..')
            // })
        })
        describe('Validations', ()=>{
            describe('Payments', ()=>{
                describe('Create', ()=>{
                    let validBody
                    beforeEach(()=>{
                        validBody = {
                            body: {
                                buyer: {
                                    name: 'Caio Majdalani',
                                    email: 'caio.majdalani@gmail.com',
                                    cpf: '04467490523'
                                },
                                date: '2019-01-01',
                                payment: {
                                    amount: 100,
                                    type: 'credit',
                                    card: {
                                        brand: 'Visa',
                                        owner: 'Jes Lewis',
                                        number: '4287794094699240',
                                        expiration: '02/2023',
                                        bin: '639'
                                    }
                                }
                            }
                        }
                    })
                    it('Valid Body JSON', ()=>{
                        let res = services.validations.payment.create(dependencies).validate(validBody)
                        expect(res.error).toBeUndefined()
                    })
                    it('Empty Body', ()=>{
                        let res = services.validations.payment.create(dependencies).validate({})
                        expect(res.error).toBeTruthy()
                    })
                    describe('Buyer', ()=>{
                        it('Empty Buyer', ()=>{
                            delete validBody.body.buyer
                            let res = services.validations.payment.create(dependencies).validate(validBody)
                            expect(res.error).toBeTruthy()
                        })
                        describe('Name', ()=>{
                            it('Without Name', ()=>{
                                delete validBody.body.buyer.name
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Name (Type)', ()=>{
                                validBody.body.buyer.name = 123
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        describe('Email', ()=>{
                            it('Without Email', ()=>{
                                delete validBody.body.buyer.email
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Email (Type)', ()=>{
                                validBody.body.buyer.email = 123
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Email (Format)', ()=>{
                                validBody.body.buyer.email = 'test.com'
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        describe('CPF', ()=>{
                            it('Without CPF', ()=>{
                                delete validBody.body.buyer.cpf
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid CPF (Type)', ()=>{
                                validBody.body.buyer.cpf = 123
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid CPF (Length)',()=>{
                                validBody.body.buyer.cpf = '044'
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        
                    })
                    describe('Date', ()=>{
                        it('Without Date', ()=>{
                            delete validBody.body.date
                            let res = services.validations.payment.create(dependencies).validate(validBody)
                            expect(res.error).toBeTruthy()
                        })
                        it('Invalid Date (Type)', ()=>{
                            validBody.body.date = 123
                            let res = services.validations.payment.create(dependencies).validate(validBody)
                            expect(res.error).toBeTruthy()
                        })
                    })
                    describe('Payment', ()=>{
                        describe('Amount', ()=>{
                            it('Without Amount', ()=>{
                                delete validBody.body.payment.amount
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Amount (Type)', ()=>{
                                validBody.body.payment.amount = '20,5'
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        describe('Type', ()=>{
                            it('Without Type', ()=>{
                                delete validBody.body.payment.type
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Type (Type)', ()=>{
                                validBody.body.payment.type = 123
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Without Type (Not Credit or Boleto)', ()=>{
                                validBody.body.payment.type = 'abc'
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        describe('Card', ()=>{
                            it('Dont send card when Type = Credit', ()=>{
                                delete validBody.body.payment.card
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Dont send card when Type = Boleto', ()=>{
                                validBody.body.payment.type = 'boleto'
                                delete validBody.body.payment.card
                                let res = services.validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeUndefined()
                            })
                            describe('Brand', ()=>{
                                it('Without Brand', ()=>{
                                    delete validBody.body.payment.card.brand
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Brand (Type)', ()=>{
                                    validBody.body.payment.card.brand = 123
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                            })
                            describe('Owner', ()=>{
                                it('Without Owner', ()=>{
                                    delete validBody.body.payment.card.owner
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Owner (Type)', ()=>{
                                    validBody.body.payment.card.owner = 123
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                            })
                            describe('Number', ()=>{
                                it('Without Number', ()=>{
                                    delete validBody.body.payment.card.number
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Number (Type)', ()=>{
                                    validBody.body.payment.card.number = 123
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Number (Length)', ()=>{
                                    validBody.body.payment.card.number = '123'
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Number (Regex)', ()=>{
                                    validBody.body.payment.card.number = 'abcdefturyhgncer'
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                            })
                            describe('Expiration', ()=>{
                                it('Without Expiration', ()=>{
                                    delete validBody.body.payment.card.expiration
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Expiration (Type)', ()=>{
                                    validBody.body.payment.card.expiration = 123
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                            })
                            describe('Bin', ()=>{
                                it('Without Bin', ()=>{
                                    delete validBody.body.payment.card.bin
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Bin (Type)', ()=>{
                                    validBody.body.payment.card.bin = 123
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Bin (Length)', ()=>{
                                    validBody.body.payment.card.bin = '1234'
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Bin (Regex)', ()=>{
                                    validBody.body.payment.card.bin = 'abc'
                                    let res = services.validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                            })
                        })
                    })
                })
                describe('FindOne', ()=>{
                    it('Valid Get', ()=>{
                        let res = services.validations.payment.findOne(dependencies).validate({})
                        expect(res.error).toBeUndefined()
                    })
                })
                describe('FindAll', ()=>{
                    it('Valid Get', ()=>{
                        let res = services.validations.payment.findAll(dependencies).validate({})
                        expect(res.error).toBeUndefined()
                    })
                })
            })
            describe('Verify', ()=>{
                let request = {}
                let response = res()
                it('Dont call errorValidation', async ()=>{
                    let result = await services.validations.verify({services, moment, joi}, 'payment', 'findOne')(request, response, jest.fn())
                    expect(result).toBe(undefined)
                })
                it('Call errorValidation', async ()=>{
                    let result = await services.validations.verify({services, moment, joi}, 'payment', 'create')(request, response, jest.fn())
                    expect(result.status).toBe(400)
                    expect(result.message).toBe('BADREQUEST')
                })
            })
        })
        describe('Replies', ()=>{
            let response = res()
            it('OK', ()=>{
                let result = services.replies.ok(response)({})
                expect(result.status).toBe(200)
                expect(result.message).toBe('OK')
            })
            it('CREATED', ()=>{
                let result = services.replies.created(response)({})
                expect(result.status).toBe(201)
                expect(result.message).toBe('CREATED')
            })
            it('ACCEPTED', ()=>{
                let result = services.replies.accepted(response)({})
                expect(result.status).toBe(202)
                expect(result.message).toBe('ACCEPTED')
            })
            it('BADREQUEST', ()=>{
                let result = services.replies.badRequest(response)({})
                expect(result.status).toBe(400)
                expect(result.message).toBe('BADREQUEST')
            })
            it('UNAUTHORIZED', ()=>{
                let result = services.replies.unauthorized(response)({})
                expect(result.status).toBe(401)
                expect(result.message).toBe('UNAUTHORIZED')
            })
            it('NOTFOUND', ()=>{
                let result = services.replies.notFound(response)({})
                expect(result.status).toBe(404)
                expect(result.message).toBe('NOTFOUND')
            })
            it('CONFLICT', ()=>{
                let result = services.replies.conflict(response)({})
                expect(result.status).toBe(409)
                expect(result.message).toBe('CONFLICT')
            })
            it('UNPROCESSABLE', ()=>{
                let result = services.replies.unprocessableEntity(response)({})
                expect(result.status).toBe(422)
                expect(result.message).toBe('UNPROCESSABLE')
            })
            it('ERROR', ()=>{
                let result = services.replies.internalServerError(response)({})
                expect(result.status).toBe(500)
                expect(result.message).toBe('ERROR')
            })
        })
        describe('Calendar', ()=>{
            it('Now Func', ()=>{
                let result = services.calendar.now({moment})
                expect(typeof result).toBe('number')
            })
        })
    })
})
