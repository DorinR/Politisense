/* eslint-env jest */
const After = require('../../../../util/queue_manager/actions').After
const AfterAction = After.VoteParticipant

const chai = require('chai')
const Assert = chai.assert

describe('Vote.js', () => {
  let undertest
  const retrieve = AfterAction.prototype.retrievePoliticians
  beforeEach(() => {
    AfterAction.prototype.retrievePoliticians = () => {
      console.log('stubbing out firebase call')
    }
    undertest = new AfterAction()
  })

  test('VoterAfterAction.js::retrievePoliticians calls Firestore with correct parliament', async (done) => {
    const desired = [43, 'politician', 'select']
    const order = []

    const mockDB = {}
    mockDB.forParliament = (parl) => {
      order.push(desired[0])
      return mockDB
    }
    mockDB.Politician = () => {
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
    undertest.retrieveBills = retrieve
    await undertest.retrieveBills(mockDB)
    Assert.equal(order.length, 24)
    for (let i = 0; i < desired.length; i++) {
      Assert.equal(desired[i], order[i % 3])
    }
    done()
  })

  test('VoterAfterAction.js::find locates politican with same name as voter', async (done) => {
    const member = 'ben wa 40'
    let id = 40
    const politicians = new Array(10)
      .fill({}, 0, 10)
      .map(i => {
        return {
          data: {
            name: 'ben wa ' + id++
          }
        }
      })

    const found = AfterAction.findPolitician(member, politicians)
    Assert.equal(found.data.name, member)
    done()
  })

  test('VoterAfterAction.js:: replace name replaces voter name with record id', async (done) => {
    let num = 0
    undertest.politicians = new Array(8)
      .fill({}, 0, 8)
      .map(i => {
        return new Array(10)
          .fill({}, 0, 10)
          .map(i => {
            return {
              data: {
                name: 'ben wa ' + num
              },
              id: `${num++}`
            }
          })
      })
    num = 70
    undertest.manager = {
      result: [{
        params: {
          parliament: 43
        },

        data: [new Array(10)
          .fill({}, 0, 10)
          .map(i => {
            return {
              member: `ben wa ${num++}`
            }
          })
        ]
      }]
    }

    await undertest.perform()

    undertest.manager.result.forEach(datum => {
      datum.data[0].forEach((record, i) => {
        const politician = undertest.politicians[7][i]
        Assert.equal(record.member, politician.data.name)
      })
    })
    done()
  })
})
