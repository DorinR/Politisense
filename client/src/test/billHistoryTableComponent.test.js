import {
  fetchUserRiding,
  fetchRepresentative,
  fetchRepresentativeVotes
} from '../Components/Dashboard/PastBills/BillHistoryTable.js'

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)
// const component = new BillHistoryTable()
// var fb = new Firestore()

describe('BillHistoryTable API Call Tests', () => {
  test('can get user riding', async () => {
    let retrievedRiding = await fetchUserRiding('cap1@gmail.com')
    retrievedRiding.should.equal('papineau')
  })
  test('can get user representative by riding', async () => {
    let retrievedRepresentative = await fetchRepresentative('papineau')
    retrievedRepresentative.should.equal('justin trudeau')
  })
})
