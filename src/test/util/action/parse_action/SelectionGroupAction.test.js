/* eslint-env jest */
const Utils = require('../../../../util/utils')
const Selector = Utils.Actions.SelectionGroupAction

const chai = require('chai')
const Assert = chai.assert

describe('SelectionGroupAction.js', () => {
  let list
  beforeAll(() => {
    list = [
      'john-smith112223344',
      'jane-smyth22222222',
      'joe-smith222222',
      'joe-smeeth221209383222',
      'joe-e-bloe222222'
    ]
  })

  test('SelectionGroupAction.js::primaryFilter searches for full selector', async (done) => {
    const selector = 'joe-smith'
    Assert.equal(list[2], Selector.primaryFilter(list, selector)[0])
    done()
  })

  test('SelectionGroupAction.js::fallbackFilter tokenises selector and looks for all tokens', async (done) => {
    const selector = 'joe-bloe'
    Assert.equal(list[4], Selector.fallbackFilter(list, selector)[0])
    done()
  })

  test('SelectionGroupAction.js::perform applies primary filter', async (done) => {
    let called = false
    const undertest = new Selector('dummy', list)
    Selector.primaryFilter = () => {
      called = true
      return ['dummy']
    }
    await undertest.perform()
    Assert(called)
    done()
  })

  test('SelectionGroupAction.js::perform applies fallbackFilter filter if primary fails', async (done) => {
    const called = []
    const undertest = new Selector('dummy', list)
    Selector.primaryFilter = () => {
      called.push(true)
      return []
    }
    Selector.fallbackFilter = () => {
      called.push(true)
      return ['dummy']
    }
    await undertest.perform()
    Assert.equal(called.length, 2)
    called.forEach(call => {
      Assert(call)
    })
    done()
  })

  test('SelectionGroupAction.js::perform always returns first match', async (done) => {
    let called = false
    const undertest = new Selector('dummy', list)
    Selector.primaryFilter = () => {
      called = true
      return ['dummy', 'other-dummy']
    }
    const ret = await undertest.perform()
    Assert(called)
    Assert.equal(ret, 'dummy')
    done()
  })
})
