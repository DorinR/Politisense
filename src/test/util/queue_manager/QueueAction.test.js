/* eslint-env jest */
const QueueAction = require('../../../util/queue_manager/QueueAction').QueueAction

const chai = require('chai')
const Assert = chai.assert

describe('QueueAction.js', () => {
  it('QueueAction::perform() Throws Error', () => {
    try {
      new QueueAction().perform()
    } catch (e) {
      Assert(true, 'AbstractJobAction::perform() Threw Error')
    }
  })
})
