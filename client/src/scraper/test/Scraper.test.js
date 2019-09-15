const Scrape = require('../src/Scraper')
const assert = require('chai').assert

// eslint-disable-next-line no-undef
describe('All Scraper Request Tests', () => {
  // eslint-disable-next-line no-undef
  test('Valid URL returns html', () => {
    const req = new Scrape.Scraper('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States')
    let html = ''
    req.scrape((result) => {
      html = result
      assert.notEqual(html, '', 'html is returned by scraping a good url')
      assert.isTrue(html.length > 1000, 'html returned should be quite large')
    })
  })
  // eslint-disable-next-line no-undef
  test('Invalid URL returns null', () => {
    const req = new Scrape.Scraper('',
      (result) => {
        assert.fail('the callback should never be used here')
      }, (result) => {
        assert.isTrue(true, 'request has failed')
      })
    req.scrape()
  })
})
