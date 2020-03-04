/* eslint-env jest */
const After = require('../../../../util/queue_manager/actions').After
const AfterAction = After.PoliticianAfterAction
const Actions = require('../../../../util/action/actions')

const chai = require('chai')
const Assert = chai.assert

describe('PoliticianAfterAction.js', () => {
  let undertest
  beforeEach(() => {
    undertest = new AfterAction()
  })

  test('PoliticianAfterAction.js::stripHyphensFromRecord replaces bad dashes from riding with single dash', async (done) => {
    const record = {
      riding:'some--riding'
    }
    undertest.stripHyphensFromRecord(record)
    Assert.equal(record.riding, 'some-riding')

    record.riding = 'some\u2014riding'
    undertest.stripHyphensFromRecord(record)
    Assert.equal(record.riding, 'some-riding')
    done()
  })

  test('PoliticianAfterAction.js::stripHyphens removes all bad hyphens', async (done) => {
    let toggle = true
    const data = new Array(10)
      .fill(null, 0, 10)
      .map((i) => {
        return {
          data: [new Array(10)
            .fill(null, 0, 10)
            .map((i) => {
              toggle = !toggle
              return {
                riding: toggle ? 'some--riding' : 'some\u2014riding'
              }
            })]
        }
      })
    undertest.manager = {
      result: data
    }
    await undertest.stripHyphens()

    data.forEach(datum => {
      datum.data[0].forEach(record => {
        Assert.equal(record.riding, 'some-riding')
      })
    })
    done()
  })

  test('PoliticianAfterAction.js::findUrl locates the politician image url from an array of names', async (done) => {
    const politician = {
      name: 'ben wa',
    }
    const links = [
      '/not-that-ben-guy',
      '/ben-wa(ooo1009)',
      '/some dude'
    ]
    const link = undertest.findUrl(politician, links)
    Assert.equal(link, links[1])
    done()
  })

  test('PoliticianAfterAction.js::attachToMPs attaches appropriate link if found to politicians', async (done) => {
    const politician = {
      name: 'ben wa',
      imageUrl: ''
    }
    const links = [
      '/not-that-ben-guy',
      '/ben-wa(ooo1009)',
      '/some dude'
    ]
    undertest.manager = {
      result: [
        { data: [[politician]] }
      ]
    }
    undertest.attachToMps(links)
    Assert.notEqual(politician.imageUrl, '')
    Assert.equal(politician.imageUrl, links[1])
    done()
  })

  test('PoliticianAfterAction.js::attachToMps sets link to unavailable if not found', async (done) => {
    const politician = {
      name: 'notbenwa',
      imageUrl: ''
    }
    const links = [
      '/not-that-ben-guy',
      '/ben-wa(ooo1009)',
      '/some dude'
    ]
    undertest.manager = {
      result: [
        { data: [[politician]] }
      ]
    }
    await undertest.attachToMps(links)
    Assert.notEqual(politician.imageUrl, '')
    Assert.equal(politician.imageUrl, 'unavailable')
    done()
  })

  test('PoliticianAfterAction.js::createFetchJob returns an anonymous Job', async (done) => {
    const job = AfterAction.createFetchJob()
    Assert.equal(job.actions.length, 4)
    Assert.equal(job.registry[0], Actions.FetchAction.name)
    Assert.equal(job.registry[1], Actions.TextParserAction.name)
    Assert.equal(job.registry[2], Actions.SelectionAction.name)
    Assert.equal(job.registry[3], 'FormatAction')
    done()
  })

  test('PoliticianAfterAction.js::perform retreives links, attachs to MPs, then replaces bad hyphens', async (done) => {
    const order = []
    const desired = ['create', 'fetch', 'link', 'strip']
    AfterAction.createFetchJob = () => {
      order.push(desired[0])
      return {
        execute: async () => {
          order.push(desired[1])
        }
      }
    }
    undertest.attachToMps = () => {
      order.push(desired[2])
    }
    undertest.stripHyphens = () => {
      order.push(desired[3])
    }

    await undertest.perform()

    Assert.equal(order.length, 4)
    for(let i = 0; i < desired.length; i++)
    {
      Assert.equal(desired[i], order[i])
    }
    done()
  })

})