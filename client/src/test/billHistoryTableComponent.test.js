import {
  fetchUserRiding,
  fetchRepresentative
} from '../Components/Dashboard/PastBills/BillHistoryTable.js'

const chai = require('chai')
chai.should()

describe('BillHistoryTable API Call Tests', () => {
  test('can get user riding', async () => {
    const retrievedRiding = await fetchUserRiding(
      'testEmailDoNotDelete@gmail.com'
    )
    retrievedRiding.should.equal('papineau')
  })
  test('can get user representative by riding', async () => {
    const retrievedRepresentative = await fetchRepresentative('papineau')
    retrievedRepresentative.should.equal('justin trudeau')
  })
})
