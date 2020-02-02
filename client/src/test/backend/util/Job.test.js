/* eslint-env jest */
const Utils = require('../../../backend/util/utils')
const Job = Utils.Job
const Action = Utils.Actions.Action

const chai = require('chai')
const Assert = chai.assert

describe('Job.js', () => {
  let undertest
  beforeEach(() => {
    undertest = new Job()
  })

  test('Job.js::create throws', async (done) => {
    try {
      Job.create('', () => {})
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('Job.js::addAction throws when adding incorrect action', async (done) => {
    try {
      undertest.addAction({ thing: 'definitely not an ES6 job' })
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('Job.js::addAction places JobAction::perform in actions array', async (done) => {
    Assert(undertest.actions.length === 0)
    undertest.addAction(new Action())
    Assert(undertest.actions.length === 1)
    Assert(typeof undertest.actions[0] === 'function')
    done()
  })

  test('Job.js::addAction places multiple JobAction::perform in increasing index order', async (done) => {
    Assert(undertest.actions.length === 0)

    let action = new Action()
    action.perform = () => { return 'first' }
    undertest.addAction(action)
    Assert(undertest.actions.length === 1)
    Assert(typeof undertest.actions[0] === 'function')

    action = new Action()
    action.perform = () => { return 'second' }
    undertest.addAction(action)
    Assert(undertest.actions.length === 2)
    Assert(typeof undertest.actions[1] === 'function')

    Assert(undertest.actions[0]() === 'first')
    Assert(undertest.actions[1]() === 'second')
    done()
  })

  test('Job.js::addErrorAction throws when not adding a JobAction', async (done) => {
    try {
      undertest.addErrorAction({ thing: 'definitely not an ES6 job' })
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('Job.js::addError action places JobAction::perform as error action', async (done) => {
    Assert(typeof undertest.handleErrors === 'function')
    Assert(undertest.handleErrors.toString() === console.error.toString())

    const action = new Action()
    undertest.addErrorAction(action)

    Assert(typeof undertest.handleErrors === 'function')
    // cannot do same function equality trick with bound functions
    // check to see if Action::perform throws instead as proxy measure
    try {
      undertest.handleErrors()
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('Job.js::addLogAction throws when adding invalid action', async (done) => {
    try {
      undertest.addLogAction({ thing: 'definitely not an ES6 job' })
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('Job.js::addLogAction places JobAction::perform as log action', async (done) => {
    Assert(typeof undertest.logAction === 'function')

    const action = new Action()
    undertest.addLogAction(action)
    Assert(typeof undertest.logAction === 'function')

    try {
      undertest.logAction()
      Assert.fail()
    } catch (e) {
      if (!(e instanceof chai.AssertionError)) {
        Assert(true)
      } else {
        throw e
      }
    }
    done()
  })

  test('Job.js::execute invokes all stored actions and chains their results', async (done) => {
    const action = new Action()
    action.perform = (prev) => {
      return prev + 1
    }
    const first = new Action()
    first.perform = () => {
      return 0
    }
    undertest
      .addAction(first)
      .addAction(action)
      .addAction(action)
      .addAction(action)
      .addAction(action)
    Assert.equal(undertest.actions.length, 5)

    const result = await undertest.execute()

    Assert.equal(result, 4)
    done()
  })

  test('Job.js::execute invokes all stored actions and invokes handleError on error', async (done) => {
    const action = new Action()
    let called = false
    action.perform = (prev) => {
      called = true
    }

    const first = new Action()
    undertest
      .addAction(first)
      .addErrorAction(action)
    Assert.equal(undertest.actions.length, 1)

    const result = await undertest.execute()
    Assert.equal(typeof result, typeof [])
    Assert(called)
    done()
  })

  test('Job.js::execute invokes all stored actions and invokes logAction at end', async (done) => {
    const action = new Action()
    let called = false
    action.perform = (prev) => {
      called = true
    }

    const first = new Action()
    undertest
      .addAction(first)
      .addLogAction(action)
    Assert.equal(undertest.actions.length, 1)

    const result = await undertest.execute()
    Assert.equal(typeof result, typeof [])
    Assert(called)
    done()
  })
})
