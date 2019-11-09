import { fetchUserData } from '../Components/Dashboard/UserAccount/ChangeAccountPassword'

const chai = require('chai')
chai.should()

describe('ChangeAccountPassword API Calls Tests', () => {
  test('can fetch user data', async () => {
    let retrievedUser = await fetchUserData('testEmailDoNotDelete@gmail.com')
    retrievedUser.email.should.equal('testEmailDoNotDelete@gmail.com')
    retrievedUser.password.should.equal('hello123')
    retrievedUser.firstname.should.equal('test')
    retrievedUser.lastname.should.equal('email')
    retrievedUser.postalCode.should.equal('h7r0c4')
    retrievedUser.riding.should.equal('papineau')
  })
})
