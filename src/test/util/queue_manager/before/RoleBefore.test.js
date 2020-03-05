/* eslint-env jest */
const Before = require('../../../../util/queue_manager/actions').Before
const BeforeAction = Before.Role

const chai = require('chai')
const Assert = chai.assert

describe('RoleBeforeAction.js', () => {
  let underTest
  let retrieve = BeforeAction.prototype.retrievePoliticians
  beforeEach(() => {
    BeforeAction.prototype.retrievePoliticians = () => {
      console.log('mocking out firebase call')
    }
    underTest = new BeforeAction()
  })

  test('RoleBeforeAction.js::formatName places string in ASCII format with hyphens', async (done) => {
    const names = [
      'Geneviève  Geneviève',
      'Adam Eve',
      'yōsēf Iōsēph'
    ]
    const correct = [
      'genevieve-genevieve',
      'adam-eve',
      'yosef-ioseph'
    ]
    for(let i = 0; i < correct.length; i++) {
      Assert.equal(correct[i], BeforeAction.formatName(names[i]))
    }
    done()
  })

  test('RoleBeforeAction.js::createRequestParams returns a query parameter object usable by axios', async (done) => {
    const params = {
      name: 'some-name',
      id: 0,
      url: 'https://www.google.ca',
      params: {
        parliament: 44,
        session: 1
      }
    }

    const corrected = BeforeAction.createRequestParams(params)
    const keys = Object.keys(corrected)
    Assert(!keys.includes('name'))
    Assert(!keys.includes('id'))

    Assert((keys).includes('url'))
    Assert.equal(corrected.url, params.url)

    Assert(keys.includes('params'))
    Assert.equal(corrected.params.parliament, params.params.parliament)
    Assert.equal(corrected.params.session, params.params.session)

    done()
  })

  test('RoleBeforeAction.js::create returns an anonymous job with correct structure', async (done) => {
    const params = {
      name: 'some-name',
      id: 0,
      url: 'https://www.google.ca',
      params: {
        parliament: 44,
        session: 1
      }
    }

    const job = BeforeAction.create(params)
    Assert(job.registry.length, 4)
    Assert(job.actions.length, 4)
    Assert(job.registry[0], 'FetchAction')
    Assert(job.registry[0], 'TextParserAction')
    Assert(job.registry[0], 'SelectionAction')
    Assert(job.registry[0], 'FormatAction')

    done()
  })

  test('RoleBeforeAction.js::retrievePoliticians retrieves all politicians in a nested array', async (done) => {
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
    let num = 0
    mockDB.select = async () => {
      order.push(desired[2])
      return new Array(10)
        .fill({}, 0, 10)
        .map(i => {
          return {
            data: () => {
              return {
                name: `some politician name${num}`,
              }
            },
            id: `${num++}`
          }
        })
    }
    underTest.retrieveVoteRecords = retrieve
    const politicians = await Promise.all(underTest.retrieveVoteRecords(mockDB))
    Assert.equal(politicians.length, 8)


    Assert.equal(order.length, 24)
    for (let i = 0; i < desired.length; i++) {
      Assert.equal(desired[i], order[i % 3])
    }

    politicians.forEach(parl => {
      Assert.equal(parl.length, 10)
      parl.forEach(politician => {
        Assert(!politician.data.name.includes(' '))
        Assert(politician.data.name.includes('-'))
        Assert.notEqual(politician.data.name, 'unknown')
      })
    })
    done()
  })

  test('RoleBeforeAction.js::modifyManagerQueryParams generates new valid query parameters', async (done) => {
    let num = 0
    underTest.politicians = new Array(8)
      .fill({}, 0, 8)
      .map(i => {
        return new Array(10)
          .fill({}, 0, 10)
          .map(i => {
            return {
              data: {
                name: `${num}`
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

    await underTest.modifyManagerQueryParams([
      'link1',
      'link2',
      'link3',
      'link4',
    ])

    Assert.equal(underTest.manager.params.length, 80)
    Assert.equal(underTest.manager.queryCount, underTest.manager.params.length)

    underTest.manager.params.forEach(param => {
      Assert(param.url.includes('https://www.google.ca'))
      Assert.equal(param.group.length, 4)
      Assert.isOk(param.params)
    })
    done()
  })

  test('RoleBeforeAction.js::perform modifies query parameter set', async (done) => {
    const params = {
      name: 'some-name',
      id: 0,
      url: 'https://www.google.ca',
      params: {
        parliament: 44,
        session: 1
      }
    }
    underTest.manager = {
      params: [params]
    }
    const desired = ['create', 'execute', 'modify']
    const order = []
    let called =
    BeforeAction.create = () => {
      order.push(desired[0])
      return {
        execute: () => {
          order.push(desired[1])
          return desired
        }
      }
    }

    underTest.modifyManagerQueryParams = (links) => {
      order.push(desired[2])
      Assert.equal(links.length, 3)
    }
    await underTest.perform()

    Assert.equal(order.length, 3)
    for (let i = 0; i < desired.length; i++) {
      Assert.equal(desired[i], order[i])
    }
    done()
  })
})