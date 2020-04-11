/* eslint-env jest */
const Action = require('../../../../util/action/wrapper_action/QueueManagerWrapperAction').QueueManagerWrapperAction
const QueueManager = require('../../../../util/queue_manager/QueueManager').QueueManager
const chai = require('chai')
const Assert = chai.assert

describe('QueueManagerWrapperAction.js', () => {
  let param
  let QueueManagerRunnerTypes
  let QueueManagerScraperTypes
  beforeAll(() => {
    param = {
      bill: 'some bill',
      parliament: 42
    }
    QueueManagerRunnerTypes = require('../../../../data/runner/runners')
    QueueManagerScraperTypes = require('../../../../data/scraper/scrapers')
  })

  test('QueueManagerWrapperAction.js accepts only QueueManager types', async (done) => {
    let accepted = Object.keys(QueueManagerRunnerTypes).every(type => {
      if (type instanceof QueueManager) {
        return new Action(type, param) !== null
      } else {
        Assert.throws(() => {
          // eslint-disable-next-line no-new
          new Action(type, param)
        })
        return true
      }
    })
    Assert(accepted)

    accepted = Object.keys(QueueManagerScraperTypes).every(type => {
      if (type instanceof QueueManager) {
        // eslint-disable-next-line no-new
        return new Action(type, param) !== null
      } else {
        Assert.throws(() => {
          // eslint-disable-next-line no-new
          new Action(type, param)
        })
        return true
      }
    })
    Assert(accepted)
    done()
  })

  test('QueueManagerWrapperAction.js::perform creates a manager and executes it', async (done) => {
    let called = false
    QueueManager.create = () => { return new QueueManager() }
    QueueManager.prototype.execute = () => { called = true }
    const action = new Action(QueueManager, param)
    await action.perform(param)
    Assert(called)
    done()
  })
})
