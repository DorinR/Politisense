/* eslint-env jest */
const ErrorActions = require('../../../../util/queue_manager/error/errors')
const ParseError = require('../../../../util/parser/parsers').DataNotFoundError
const ScrapeError = require('../../../../util/action/error/errors').ScrapeError

const chai = require('chai')
const Assert = chai.assert

describe('ErrorActions', () => {

  describe('ThrowErrorAction.js', () => {
    let manager
    beforeEach(() => {
      manager = {
        queryCount: 10,
        lock: {
          acquire: async () => {},
          release: () => {}
        }
      }
    })

    test('ThrowErrorAction.js rethrows any error, without decrementing', async (done) => {
      const underTest = new ErrorActions.Throw(manager)
      try {
        await underTest.perform(new Error())
        Assert.fail()
      } catch (e) {
        if ((e instanceof chai.AssertionError)) {
          throw e
        }
        Assert.equal(manager.queryCount, 10)
      }
      done()
    })
  })

  describe('GenericErrorAction.js', () => {
    let manager
    beforeEach(() => {
      manager = {
        queryCount: 10,
        lock: {
          acquire: async () => {},
          release: () => {}
        }
      }
    })

    test('GenericErrorAction.js Throws Error on specified type and decrements query count in manager', async (done) => {
      const underTest = new ErrorActions.GenericErrorAction(manager, TypeError)
      try {
        await underTest.perform(new RangeError())
        await underTest.perform(new TypeError())
        Assert.fail()
      } catch (e) {
        if((e instanceof chai.AssertionError)) {
          throw e
        }
        Assert.equal(manager.queryCount, 8)
      }
      done()
    })
  })

  describe('ParseErrorAction.js', () => {
    let manager
    beforeEach(() => {
      manager = {
        queryCount: 10,
        lock: {
          acquire: async () => {},
          release: () => {}
        }
      }
    })

    test('ParseErrorAction.js Throws Error on an XMLParseError and decrements query count', async (done) => {
      const underTest = new ErrorActions.ParseErrorAction(manager)
      try {
        await underTest.perform(new ParseError())
        Assert.fail()
      } catch (e) {
        if ((e instanceof chai.AssertionError)) {
          throw e
        }
        Assert.equal(manager.queryCount, 9)
      }
      done()
    })
  })

  describe('ScrapeErrorAction.js', () => {
    let manager
    beforeEach(() => {
      manager = {
        queryCount: 10,
        lock: {
          acquire: async () => {},
          release: () => {}
        }
      }
    })

    test('ScrapeErrorAction.js Throws Error on an ScrapeError and decrements query count', async (done) => {
      const underTest = new ErrorActions.ScrapeErrorAction(manager)
      try {
        await underTest.perform(new ScrapeError())
        Assert.fail()
      } catch (e) {
        if ((e instanceof chai.AssertionError)) {
          throw e
        }
        Assert.equal(manager.queryCount, 9)
      }
      done()
    })
  })
})