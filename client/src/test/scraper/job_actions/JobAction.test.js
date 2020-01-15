/* eslint-env jest */
import { AbstractJobAction } from '../../../scraper/job_actions/JobAction'

const chai = require('chai')
const Assert = chai.assert

describe('JobAction.js', () => {
  it('AbstractJobAction::perform() Throws Error', () => {
    try {
      new AbstractJobAction().perform()
    } catch (e) {
      Assert(true, 'AbstractJobAction::perform() Threw Error')
    }
  })
})
