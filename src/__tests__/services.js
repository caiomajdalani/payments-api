'use strict'

const checkers = require('../services/utils/checkers')
const converters = require('../services/utils/converters')

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
    })
})
