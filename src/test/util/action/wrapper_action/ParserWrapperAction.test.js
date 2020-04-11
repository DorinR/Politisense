/* eslint-env jest */
const Action = require('../../../../util/action/actions').ParserWrapperAction
const ParseError = require('../../../../util/parser/parsers').DataNotFoundError

const chai = require('chai')
const Assert = chai.assert

describe('ParserWrapperAction.js', () => {
  let result
  let param
  let parserTypes
  beforeAll(() => {
    param = {
      bill: 'some bill',
      parliament: 42
    }
    parserTypes = require('../../../../util/parser/parsers')
    result = {
      totally: 'valid',
      data: 'model'
    }
  })

  test('ParserWrapperAction.js accepts only parser types', async (done) => {
    const accepted = Object.keys(parserTypes).every(type => {
      if (type instanceof parserTypes.XmlDataParser) {
        // eslint-disable-next-line no-new
        return new Action(type, param) !== null
      } else {
        Assert.throws(() => {
          // eslint-disable-next-line no-new
          new Action(type, param)
        })
        return true
      }
    })
    Assert(accepted)
    done()
  })

  test('ParserWrapperAction.js::perform throws on no xml provided', async (done) => {
    Assert.throws(() => {
      new Action(param, parserTypes.RoleXmlParser).perform('')
    })
    done()
  })

  test('ParserWrapperAction.js::perform can return all data models as an array', async (done) => {
    const type = parserTypes.RoleXmlParser
    type.prototype.hasData = () => { return true }
    type.prototype.hasListOfData = () => { return true }
    type.prototype.getAllFromXml = () => {
      return result
    }
    const action = new Action(type, param)
    const ret = await action.perform('a very valid xml string')
    Assert(ret instanceof Array)
    Assert.equal(ret[0], result)
    done()
  })

  test('ParserWrapperAction.js::perform can return single data model', async (done) => {
    const type = parserTypes.RoleXmlParser
    type.prototype.hasData = () => { return true }
    type.prototype.hasListOfData = () => { return false }
    type.prototype.xmlToJson = () => {
      return result
    }
    const action = new Action(type, param)
    const ret = await action.perform('a very valid xml string')
    Assert(ret instanceof Object)
    Assert.equal(ret, result)
    done()
  })

  test('ParserWrapperAction.js::perform throws on invalid xml', async (done) => {
    const type = parserTypes.RoleXmlParser
    type.prototype.hasData = () => { return false }
    type.prototype.hasListOfData = () => { return false }
    type.prototype.xmlToJson = () => {
      return result
    }
    const action = new Action(type, param)
    try {
      await action.perform('a very valid xml string')
      Assert.fail()
    } catch (e) {
      if (e instanceof chai.AssertionError) {
        throw e
      }
      if (!(e instanceof ParseError)) {
        Assert.fail()
      }
    }
    done()
  })
})
