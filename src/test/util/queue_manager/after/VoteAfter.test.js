/* eslint-env jest */
const After = require('../../../../util/queue_manager/actions').After
const AfterAction = After.Vote

const chai = require('chai')
const Assert = chai.assert

describe('Vote.js', () => {
  let underTest
  const retrieve = AfterAction.prototype.retrieveBills
  beforeEach(() => {
    AfterAction.prototype.retrieveBills = () => {
      console.log('mocking out firebase call')
    }
    underTest = new AfterAction()
  })

  test('Vote.js::findBill locates bill with correct year and same billID as vote', async (done) => {
    const vote = {
      year: 2000,
      billNumber: 42
    }
    let id = 40
    let year = 1998
    const bills = new Array(10)
      .fill({}, 0, 10)
      .map(i => {
        return {
          data: {
            number: id++,
            dateVoted: `${year++}`
          }
        }
      })

    const found = AfterAction.findBill(vote, bills)
    Assert.equal(found.data.number, vote.billNumber)
    Assert(found.data.dateVoted.includes(vote.year) || found.data.dateVoted.includes(vote.year - 1))
    done()
  })

  test('Vote.js::retrieveBills calls Firestore with correct parliament', async (done) => {
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
        data: () => { return 'a' },
        id: 'a'
      }]
    }
    underTest.retrieveBills = retrieve
    await underTest.retrieveBills(mockDB)
    Assert.equal(order.length, 24)
    for (let i = 0; i < desired.length; i++) {
      Assert.equal(desired[i], order[i % 3])
    }
    done()
  })

  test('Vote.js::attachBillsToVotes modifies links to foreign key them with votes', async (done) => {
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
                number: id++,
                dateVoted: `${year++}`
              },
              id: `${num++}`
            }
          })
      })

    let billNumber = 40
    let year = 1998
    underTest.manager = {
      result: [{
        params: {
          params: {
            parlSession: 153
          }
        },

        data: [new Array(10)
          .fill({}, 0, 10)
          .map(i => {
            return {
              billNumber: billNumber++,
              year: year++,
              bill: ''
            }
          })
        ]
      }]
    }

    await underTest.perform()

    underTest.manager.result.forEach(datum => {
      datum.data[0].forEach((record, i) => {
        const bill = underTest.bills[7][i]
        Assert.equal(record.bill, bill.id)
      })
    })
    done()
  })
})
