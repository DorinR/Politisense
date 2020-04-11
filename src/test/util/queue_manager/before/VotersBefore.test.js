/* eslint-env jest */
const Before = require('../../../../util/queue_manager/actions').Before
const BeforeAction = Before.VoteParticipant

const chai = require('chai')
const Assert = chai.assert

describe('VoteBeforeAction.js', () => {
  let underTest
  const retrieve = BeforeAction.prototype.retrieveVoteRecords
  beforeEach(() => {
    BeforeAction.prototype.retrieveVoteRecords = () => {
      console.log('mocking out firebase call')
    }
    underTest = new BeforeAction()
  })

  test('VoteBeforeAction.js::retrieveVoteRecords calls firestore with correct parliament', async (done) => {
    const desired = [43, 'voteRecord', 'select']
    const order = []

    const mockDB = {}
    mockDB.forParliament = (parl) => {
      order.push(desired[0])
      return mockDB
    }
    mockDB.VoteRecord = () => {
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
    underTest.retrieveVoteRecords = retrieve
    await underTest.retrieveVoteRecords(mockDB)
    Assert.equal(order.length, 24)
    for (let i = 0; i < desired.length; i++) {
      Assert.equal(desired[i], order[i % 3])
    }
    done()
  })

  test('VoteBeforeAction.js::parliamentExists returns true on valid parliament', async (done) => {
    Assert(BeforeAction.parliamentExists(41, 1))
    done()
  })

  test('VoteBeforeAction.js::parliamentExists returns false on invalid parliament', async (done) => {
    Assert(!BeforeAction.parliamentExists(41, 3))
    done()
  })

  test('VoteBeforeAction.js::perform modifies query parameter set', async (done) => {
    let called = false
    underTest.modifyManagerParams = () => { called = true }
    await underTest.perform()
    Assert(called)
    done()
  })

  test('VoteBeforeAction.js::modifyManagerParams creates a new valid manager query set', async (done) => {
    let num = 0
    underTest.voteRecords = new Array(10)
      .fill({}, 0, 10)
      .map(i => {
        return new Array(10)
          .fill({}, 0, 10)
          .map(i => {
            return {
              data: {
                id: `${num}`
              },
              id: `${num++}`
            }
          })
      })

    num = 0
    underTest.manager = {
      queryCount: 0
    }
    underTest.manager.params = new Array(8)
      .fill({}, 0, 8)
      .map(i => {
        return {
          url: 'https://www.google.ca',
          params: {
            parliament: num + 36,
            session: num % 4 === 0 ? (num++ % 4) + 1 : ++num % 4
          }
        }
      })

    await underTest.modifyManagerParams()

    Assert.equal(underTest.manager.params.length, 20)
    Assert.equal(underTest.manager.queryCount, underTest.manager.params.length)

    underTest.manager.params.forEach(param => {
      Assert(param.url.includes(`https://www.google.ca/${param.id}/xml`))
      Assert.isOk(param.parliament)
    })
    done()
  })
})
