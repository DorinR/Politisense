const Scrape = require('../src/Scraper')
const Parse = require('../src/Parser')
const assert = require('chai').assert

// eslint-disable-next-line no-undef
describe('All Parser Tests', () => {
  // eslint-disable-next-line no-undef
  test('Parser can find pattern', () => {
    let links = 0
    const p = new Parse.Parser('a', (selected) => {
      links = links + 1
    })
    const req = new Scrape.Scraper('https://www.google.ca', (result) => {
      p.parse(result)
      assert.isTrue(links > 0)
    }, (e) => {
      throw new Parse.ParseError(e.message)
    })
    req.scrape()
  })
  // eslint-disable-next-line no-undef
  test('Parser cannot find fake patterns', () => {
    let links = 0
    const p = new Parse.Parser('', (selected) => {
      links = links + 1
    })
    const req = new Scrape.Scraper('https://www.google.ca', (result) => {
      p.parse(result)
      assert.isTrue(links < 1)
      console.log(links)
    }, (e) => {
      throw new Parse.ParseError(e.message)
    })
    req.scrape()
  })
})
