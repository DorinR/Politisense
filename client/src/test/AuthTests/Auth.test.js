import { fetchUser, loginAPICall } from '../../Components/Auth/Login'
import { signupAPICall } from '../../Components/Auth/SignUp'
import { setRiding } from '../../Components/Questionnaire'

const chai = require('chai')
chai.should()

describe('checks if the user exist ', () => {
  test('checks if user exists or not in firebase db', async () => {
    const res = await fetchUser('baraka.khalid4@gmail.com')
    res.data.success.should.equal(true)
  })
})

describe('testing login functionality ', () => {
  test('logs user into the system', async () => {
    const res = await loginAPICall({
      email: 'ishmammurtaza@gmail.com',
      password: 'hello123'
    })
    res.data.success.should.equal(true)
  })
})

describe('testing signup functionality ', () => {
  test('registers user into the system', async () => {
    const res = await signupAPICall({
      email: 'ishmammurtaza@gmail.com',
      password: 'hello123'
    })
    res.data.success.should.equal(true)
  })
})

describe("checks the user's postal code ", () => {
  test('check if postal code matches a federal riding', async () => {
    const res = await setRiding(
      'J7W0A1'
    )
    res.data.success.should.equal(true)
  })
})
