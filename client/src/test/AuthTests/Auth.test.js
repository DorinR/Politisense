/* eslint-env jest */
import { checkEmailFormat } from '../../Components/Auth/Login'

const chai = require('chai')
chai.should()

describe('client/src/Components/Auth/Login.js Tests', () => {
  test('Login.js::checkEmailFormat returns array of matches when valid', () => {
    const res = checkEmailFormat('baraka.khalid4@gmail.com')
    expect(res.length).not.toBe(0)
  })

  test('Login.js::checkEmailFormat returns null when invalid', () => {
    const res = checkEmailFormat('baraka.khalid4')
    expect(res).toBe(null)
  })
})
