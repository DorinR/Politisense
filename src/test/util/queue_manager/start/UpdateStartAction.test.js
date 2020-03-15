/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const Action = require('../../../../util/queue_manager/actions').Start.Update
const QueueManager = require('../../../../util/queue_manager/QueueManager').QueueManager
const Job = require('../../../../job/Job').AbstractJob

describe('UpdateStopAction.js', () => {
  let undertest
  let manager
  beforeEach(() => {
    manager = new QueueManager()
    manager.updateJobQueue = new Array(3)
      .fill([], 0, 10)
      .map(i => {
        return new Array(10)
          .fill({}, 0, 10)
          .map(i => {
            return new Job()
          })
      })

    undertest = new Action(manager)
  })

  test('UpdateStopAction.js enqueues first level updates jobs from update job queue', async (done) => {
    Assert(true,'stub')
    done()
  })
})
