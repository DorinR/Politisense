/* eslint-env jest */
import { Selector } from '../../../../backend/util/action/parse_action/SelectionAction'

const chai = require('chai')
const Assert = chai.assert

describe('SelectionAction.js', () => {
  let underTest
  let testLinks

  function validResponse (links) {
    Assert.equal(typeof links, typeof {})
    Assert.equal(typeof links.other, typeof [])
    Assert.equal(typeof links.selected, typeof [])
  }

  beforeAll(() => {
    testLinks = [
      'https://www.google.ca/xml',
      'https://www.google.ca/',
      'https://www.google.com/',
      'https://www.youtwitface.com/',
      'https://www.youtwitface.ca/xml'
    ]
  })

  beforeEach(() => {
    underTest = new Selector('xml')
  })

  it('SelectionAction::perform() returns links by selection', async (done) => {
    const didSelect = await underTest.perform(testLinks)
      .then(links => {
        validResponse(links)
        Assert.equal(links.selected.length, 2)
        Assert.equal(links.other.length, 3)
        return true
      })
    Assert.equal(didSelect, true)
    done()
  })

  it('SelectionAction::perform() can be chained across instances', async (done) => {
    let resp = await underTest
      .perform(testLinks)
      .then(links => {
        validResponse(links)
        console.log(links)
        Assert.equal(links.selected.length, 2)
        Assert.equal(links.other.length, 3)
        return {
          valid: true,
          links: links
        }
      })
    Assert.equal(resp.valid, true)
    resp = await new Selector('google')
      .perform(resp.links)
      .then(links => {
        validResponse(links)
        Assert.equal(links.selected.length, 1)
        Assert.equal(links.other.length, 1)
        return {
          valid: true,
          links: links
        }
      })
    Assert.equal(resp.valid, true)
    done()
  })
})
