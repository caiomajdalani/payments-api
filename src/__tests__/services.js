'use strict'

const checkers = require('../services/utils/checkers')
const converters = require('../services/utils/converters')
const validations = require('../services/validations/index')

const dependencies = require('../configurations/dependencies/index')

describe('Services', () => {
    describe('Utils', () => {
        describe('Checkers', () => {
            describe('isEmail Func', ()=>{
                it('Valid Email', ()=>{
                    expect(checkers.isEmail('test@test.com')).toBe(true)
                })
                it('Invalid Email', ()=>{
                    expect(checkers.isEmail('testtest.com')).toBe(false)
                })
            })
            describe('isCPF Func', ()=>{
                it('Valid CPF', ()=>{
                    expect(checkers.isCPF('04467490523')).toBe(true)
                })
                it('Invalid CPF (Length)', ()=>{
                    expect(checkers.isCPF('123')).toBe(false)
                })
                it('Invalid CPF (Identical Numbers)', ()=>{
                    expect(checkers.isCPF('00000000000')).toBe(false)
                })
                it('Invalid CPF (First Digit Position)', ()=>{
                    expect(checkers.isCPF('12345678919')).toBe(false)
                })
                it('Invalid CPF (Second Digit Position)', ()=>{
                    expect(checkers.isCPF('12345678908')).toBe(false)
                })
                it('Invalid CPF (Second Digit Position 2)', ()=>{
                    expect(checkers.isCPF('01234567891')).toBe(false)
                })
                
            })
            describe('isNumber Func', ()=>{
                it('Valid Number', ()=>{
                    expect(checkers.isNumber(123)).toBe(true)
                })
                it('Valid Number on String', ()=>{
                    expect(checkers.isNumber('123')).toBe(true)
                })
                it('Invalid Number', ()=>{
                    expect(checkers.isNumber('abc')).toBe(false)
                })
            })
            // describe('isCharacter Func', ()=>{
            //     it('Valid Char', ()=>{
            //         expect(checkers.isCharacter('abc')).toBe(true)
            //     })
            //     it('Invalid Char', ()=>{
            //         expect(checkers.isCharacter('*_$')).toBe(false)
            //     })
            // })
            describe('isValidAge Func', ()=>{
                it('Over 18', ()=>{
                    expect(checkers.isValidAge(dependencies)('1999-01-01')).toBe(true)
                })
                it('Under 18', ()=>{
                    expect(checkers.isValidAge(dependencies)('2019-01-01')).toBe(false)
                })
                it('Invalid date length', ()=>{
                    expect(checkers.isValidAge(dependencies)('2019-01')).toBe(false)
                })
            })
            describe('isValidSchedule Func', ()=>{
                it('Valid Date for Schedule', ()=>{
                    let date = dependencies.moment({_i: 'YYYY-MM-DD'}).add(1, 'years')
                    expect(checkers.isValidSchedule(dependencies)(date)).toBe(true)
                })
                it('Invalid Date for Schedule', ()=>{
                    let date = dependencies.moment({_i: 'YYYY-MM-DD'}).subtract(1, 'years')
                    expect(checkers.isValidSchedule(dependencies)(date)).toBe(false)
                })
            })
            describe('isValidDate Func', ()=>{
                it('Valid Date', ()=>{
                    expect(checkers.isValidDate(dependencies)('2019-02-02')).toBe(true)
                })
                it('Invalid Date', ()=>{
                    expect(checkers.isValidDate(dependencies)('2019-13-02')).toBe(false)
                })
            })
        })
        describe('Converters', () => {
            it('toBufferEncode func', ()=>{
                let buffer = converters.toBufferEncode('Testing buffer encode..')
                expect(Buffer.isBuffer(buffer)).toBe(true)
            })
            // it('toBufferDecode func', ()=>{
            //     expect(converters.toBufferDecode(buffer)).toBe('Testing buffer encode..')
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
                        let res = validations.payment.create(dependencies).validate(validBody)
                        expect(res.error).toBeUndefined()
                    })
                    it('Empty Body', ()=>{
                        let res = validations.payment.create(dependencies).validate({})
                        expect(res.error).toBeTruthy()
                    })
                    describe('Buyer', ()=>{
                        it('Empty Buyer', ()=>{
                            delete validBody.body.buyer
                            let res = validations.payment.create(dependencies).validate(validBody)
                            expect(res.error).toBeTruthy()
                        })
                        describe('Name', ()=>{
                            it('Without Name', ()=>{
                                delete validBody.body.buyer.name
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Name (Type)', ()=>{
                                validBody.body.buyer.name = 123
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        describe('Email', ()=>{
                            it('Without Email', ()=>{
                                delete validBody.body.buyer.email
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Email (Type)', ()=>{
                                validBody.body.buyer.email = 123
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Email (Format)', ()=>{
                                validBody.body.buyer.email = 'test.com'
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        describe('CPF', ()=>{
                            it('Without CPF', ()=>{
                                delete validBody.body.buyer.cpf
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid CPF (Type)', ()=>{
                                validBody.body.buyer.cpf = 123
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid CPF (Length)',()=>{
                                validBody.body.buyer.cpf = '044'
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        
                    })
                    describe('Date', ()=>{
                        it('Without Date', ()=>{
                            delete validBody.body.date
                            let res = validations.payment.create(dependencies).validate(validBody)
                            expect(res.error).toBeTruthy()
                        })
                        it('Invalid Date (Type)', ()=>{
                            validBody.body.date = 123
                            let res = validations.payment.create(dependencies).validate(validBody)
                            expect(res.error).toBeTruthy()
                        })
                    })
                    describe('Payment', ()=>{
                        describe('Amount', ()=>{
                            it('Without Amount', ()=>{
                                delete validBody.body.payment.amount
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Amount (Type)', ()=>{
                                validBody.body.payment.amount = '20,5'
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        describe('Type', ()=>{
                            it('Without Type', ()=>{
                                delete validBody.body.payment.type
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Invalid Type (Type)', ()=>{
                                validBody.body.payment.type = 123
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Without Type (Not Credit or Boleto)', ()=>{
                                validBody.body.payment.type = 'abc'
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                        })
                        describe('Card', ()=>{
                            it('Dont send card when Type = Credit', ()=>{
                                delete validBody.body.payment.card
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeTruthy()
                            })
                            it('Dont send card when Type = Boleto', ()=>{
                                validBody.body.payment.type = 'boleto'
                                delete validBody.body.payment.card
                                let res = validations.payment.create(dependencies).validate(validBody)
                                expect(res.error).toBeUndefined()
                            })
                            describe('Brand', ()=>{
                                it('Without Brand', ()=>{
                                    delete validBody.body.payment.card.brand
                                    let res = validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Brand (Type)', ()=>{
                                    validBody.body.payment.card.brand = 123
                                    let res = validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                            })
                            describe('Owner', ()=>{
                                it('Without Owner', ()=>{
                                    delete validBody.body.payment.card.owner
                                    let res = validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Owner (Type)', ()=>{
                                    validBody.body.payment.card.owner = 123
                                    let res = validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                            })
                            describe('Number', ()=>{
                                it('Without Number', ()=>{
                                    delete validBody.body.payment.card.number
                                    let res = validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Number (Type)', ()=>{
                                    validBody.body.payment.card.number = 123
                                    let res = validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Number (Length)', ()=>{
                                    validBody.body.payment.card.number = '123'
                                    let res = validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                                it('Invalid Number (Regex)', ()=>{
                                    validBody.body.payment.card.number = 'abcdefturyhgncer'
                                    let res = validations.payment.create(dependencies).validate(validBody)
                                    expect(res.error).toBeTruthy()
                                })
                            })
                            // describe('Expiration', ()=>{
                            //     it('Without Expiration', ()=>{
                                    
                            //     })
                            //     it('Invalid Expiration (Type)', ()=>{
                                    
                            //     })
                            // })
                            // describe('Bin', ()=>{
                            //     it('Without Bin', ()=>{
                                    
                            //     })
                            //     it('Invalid Bin (Type)', ()=>{
                                    
                            //     })
                            //     it('Invalid Bin (Length)', ()=>{
                                    
                            //     })
                            //     it('Invalid Bin (Regex)', ()=>{
                                    
                            //     })
                            // })
                        })
                    })
                })
            })
        })
    })
})
