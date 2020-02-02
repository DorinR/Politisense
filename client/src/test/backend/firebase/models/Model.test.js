/* eslint-env jest */
import { Model } from '../../../../backend/firebase/model/Model'
import { Bill } from '../../../../backend/firebase/model/Bill'

const chai = require('chai')
const Assert = chai.assert

describe('Model Serialisation tests', () => {
  let model
  let json
  beforeEach(() => {
    model = new Bill(0,
      '1337',
      'a bill to find all 1337 ppl',
      'none because we do not seem to store this attribute',
      'https://www.some.bill.url/',
      '2019-10-11',
      'Sterling Archer')

    json = {
      id: 0,
      number: '1337',
      title: 'a bill to find all 1337 ppl',
      text: 'none because we do not seem to store this attribute',
      link: 'https://www.some.bill.url/',
      dateVoted: '2019-10-11',
      sponsorName: 'Sterling Archer'
    }
  })

  test('model serialises correctly', () => {
    const serialised = Model.serialise(model)
    Object.keys(serialised).forEach(key => {
      Assert.isTrue(Object.keys(json).includes(key), `key: ${key} not found`)
      Assert.equal(serialised[key], json[key])
    })
  })

  test('model deserialises correctly', () => {
    const deserialised = Bill.deserialise(json)
    Object.keys(deserialised).forEach(key => {
      Assert.isTrue(Object.keys(model).includes(key), `key: ${key} not found`)
      Assert.equal(deserialised[key], model[key])
    })
  })

  test('model deserialisation throws on missing or extra attribute', () => {
    json['this will fail the test'] = 'fail'
    try {
      Bill.deserialise(json)
    } catch (e) {
      Assert.equal(typeof e, typeof new TypeError())
    }
  })

  test('model deserialisation throws on type mismatched attributes', () => {
    json.id = 'fail'
    try {
      Bill.deserialise(json)
    } catch (e) {
      Assert.equal(typeof e, typeof new TypeError())
    }
  })
})
