/* eslint-env jest */
const RequeueAction = require('../../../../util/utils').Actions.RequeueAction

const chai = require('chai')
const Assert = chai.assert

describe('RequeueConnectionAction.js', () => {
  let undertest
  const data = {
    selected: [
      'a',
      'b',
      'c',
      'd'
    ],
    other: [
      'd',
      'e',
      'f'
    ]
  }
  beforeEach(() => {
    undertest = new RequeueAction(() => {}, () => {}, [])
  })

  test('RequeueConnectionAction.js::creates new jobs using data and callback', async (done) => {
    let count = 0
    const callback = () => {
      count++
    }
    undertest.create = callback
    const result = await undertest.perform(data)
    Assert(count === 3)
    Assert(result.length === 4)
    done()
  })
})
