/* eslint-env jest */
const Before = require('../../../../util/queue_manager/actions').Before
const BeforeAction = Before.BillLinkFetch

const chai = require('chai')
const Assert = chai.assert

describe('BillLinkFetchBeforeAction.js', () => {
  let underTest
  const retrieve = BeforeAction.prototype.retrieveBills
  beforeEach(() => {
    BeforeAction.prototype.retrieveBills = () => {
      console.log('mocking out firebase call')
    }
    underTest = new BeforeAction()
  })

  test('BillLinkFetchBeforeAction.js::retrieveBills calls firestore with correct parliament', async (done) => {
    const desired = [43, 'bill', 'select']
    const order = []

    const mockDB = {}
    mockDB.forParliament = (parl) => {
      order.push(desired[0])
      return mockDB
    }
    mockDB.Bill = () => {
      order.push(desired[1])
      return mockDB
    }
    mockDB.select = async () => {
      order.push(desired[2])
      return [{
        data: () => {
          return { link: 'www.google.ca' }
          },
        id: 'a'
      }]
    }
    underTest.retrieveVoteRecords = retrieve
    await underTest.retrieveVoteRecords(mockDB)
    Assert.equal(order.length, 24)
    for (let i = 0; i < desired.length; i++) {
      Assert.equal(desired[i], order[i % 3])
    }
    done()
  })

  test('BillLinkFetchBeforeAction.js::perform modifies manager query parameter set', async (done) => {
    let called = false
    underTest.createQueryParams = () => {called = true}
    await underTest.perform()
    Assert(called)
    done()
  })

  test('BillLinkFetchBeforeAction.js::createQueryParams modifies manager query parameter set', async (done) => {
    let num = 0
    underTest.bills = new Array(8)
      .fill({}, 0, 8)
      .map(i => {
        let id = 40
        let year = 1998
        return new Array(10)
          .fill({}, 0, 10)
          .map(i => {
            return {
              data: {
                link: 'https://www.google.ca',
              },
              id: `${num++}`
            }
          })
      })

    num = 0
    underTest.manager = {
      queryCount: 0
    }
    underTest.manager.params = new Array(10)
      .fill({}, 0, 10)
      .map(i => {
        return {
          parliament: ++num + 36,
        }
      })

    await underTest.createQueryParams()

    Assert.equal(underTest.manager.params.length, 70)
    Assert.equal(underTest.manager.queryCount, underTest.manager.params.length)

    underTest.manager.params.forEach(param => {
      Assert(param.url.includes('https://www.google.ca'))
      Assert.isOk(param.parliament)
      Assert.isOk(param.bill)
    })
    done()
  })
})