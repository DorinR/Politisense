import  {fetchUser, loginAPICall} from '../../Components/Auth/Login'

const chai = require('chai')
chai.should()

describe('checks if the user exist ', () => {
    test('checks if user exists or not in firebase db', async () => {
        let res = await fetchUser("baraka.khalid4@gmail.com")

        res.data.success.should.equal(true)
    })
})


describe('testing login functionality ', () => {
    test('logs user into the system', async () => {
        let res = await loginAPICall({email:'ishmammurtaza@gmail.com', password: "hello123"})
        res.data.success.should.equal(true)
    })
})



