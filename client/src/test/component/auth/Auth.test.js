/* eslint-env jest */
<<<<<<< HEAD:client/src/test/component/auth/Auth.test.js
import { checkEmailFormat } from '../../../Components/Auth/Login'
=======
import { checkEmailFormat } from '../../../component/auth/Login'
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/test/component/auth/Auth.test.js

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
