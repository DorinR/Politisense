/* eslint-env jest */
const LogAction = require('../../../../util/queue_manager/log/DefaultLogAction').DefaultLogAction

const chai = require('chai')
const Assert = chai.assert

describe('DefaultLogErrorAction.js', () => {
  let underTest
  const consoleLog = console.log
  const array = []
  beforeEach(() => {
    underTest = new LogAction()
  })

  test('DefaultLogErrorAction.js::perform returns passed in result', async (done) => {
    const result = underTest.perform(array)
    Assert.equal(result, array)
    done()
  })

  test('DefaultLogErrorAction.js::perform returns length of data if object passed in with data attribute', async (done) => {
    console.log = (message) => {
      Assert(message.includes('3 potential results'))
    }
    underTest.perform({
      data: ['a', 'b', 'c']
    })
    console.log = consoleLog
    done()
  })

  test('DefaultLogErrorAction.js::perform returns 0 if object passed in with no data attribute', async (done) => {
    console.log = (message) => {
      Assert(message.includes('0 potential results'))
    }
    underTest.perform({})
    console.log = consoleLog
    done()
  })

  test('DefaultLogErrorAction.js::perform returns length of array if passed array', async (done) => {
    console.log = (message) => {
      Assert(message.includes('3 potential results'))
    }
    underTest.perform(['a', 'b', 'c'])
    console.log = consoleLog
    done()
  })

  test('DefaultLogErrorAction.js::perform returns 0 if truthy value that is not an array or object', async (done) => {
    console.log = (message) => {
      Assert(message.includes('finished with value'))
    }
    underTest.perform('a')
    console.log = consoleLog
    done()
  })

  test('DefaultLogErrorAction.js::peform logs warning on falsy value', async (done) => {
    console.log = (message) => {
      Assert(message.includes('undefined or null'))
    }
    underTest.perform(null)
    console.log = consoleLog
    done()
  })
})
