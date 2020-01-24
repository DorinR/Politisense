/* eslint-env jest */
import { Selector } from '../../../scraper/job_actions/SelectionAction'

const chai = require('chai')
const Assert = chai.assert

describe('SelectionAction.js', () => {
  let underTest
  let testLinks
  beforeAll(() => {
    underTest = new Selector('xml')
    testLinks = [
      'https://www.google.ca/xml',
      'https://www.google.ca/',
      'https://www.google.com/',
      'https://www.youtwitface.com/',
      'https://www.youtwitface.ca/xml'
    ]
  })

  it('SelectionAction::perform() returns all xml links', async (done) => {
    const didSelect = await underTest.perform(testLinks)
      .then(raw => {
        Assert.equal(typeof raw, typeof [])
        Assert.equal(raw.length, 3)
        return true
      })
    Assert.equal(didSelect, true)
    Assert.equal(typeof underTest.selected, typeof [])
    Assert.equal(underTest.selected.length, 2)
    done()
  })
})
