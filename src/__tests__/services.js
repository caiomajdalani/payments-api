'use strict'

const checkers = require('../services/utils/checkers')
const converters = require('../services/utils/converters')

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
                it('Invalid CPF', ()=>{
                    expect(checkers.isCPF('00000000000')).toBe(false)
                })
            })
        })
        describe('Converters', () => {
            it('toBufferEncode func', ()=>{
                expect(converters.toBufferEncode('Testing buffer encode..')).toBe({"data": [34, 84, 101, 115, 116, 105, 110, 103, 32, 98, 117, 102, 102, 101, 114, 32, 101, 110, 99, 111, 100, 101, 46, 46, 34], "type": "Buffer"})
            })
            it('toBufferDecode func', ()=>{
                expect(converters.toBufferEncode({"data": [34, 84, 101, 115, 116, 105, 110, 103, 32, 98, 117, 102, 102, 101, 114, 32, 101, 110, 99, 111, 100, 101, 46, 46, 34], "type": "Buffer"})).toBe('Testing buffer encode..')
            })
        })
    })
})
