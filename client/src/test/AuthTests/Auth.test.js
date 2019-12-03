/* eslint-env jest */
import { checkEmailFormat } from '../../Components/Auth/Login'

const chai = require('chai')
chai.should()

describe('checks the inserted email format ', () => {
  test('should return an array of possible matches when format is valid', () => {
    const res = checkEmailFormat('baraka.khalid4@gmail.com')
    expect(res.length).not.toBe(0)
  })

  test('should return an empty array  when the format is not valid', () => {
    const res = checkEmailFormat('baraka.khalid4')
    expect(res).toBe(null)
  })
})
