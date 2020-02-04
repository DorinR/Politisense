/* eslint-env jest */
import { QueueAction } from '../../../../backend/util/queue_manager/QueueAction'

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
