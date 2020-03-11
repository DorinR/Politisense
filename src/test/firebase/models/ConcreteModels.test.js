/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert
const Model = require('@model')

describe('ConcreteModels.js', () => {
  test('Bill.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.Bill()
    })
    done()
  })

  test('Bill.js accepts 1 number and 6 string params, respectively', async (done) => {
    new Model.Bill(1, ' ', ' ', ' ', ' ', ' ', ' ')
    done()
  })

  test('BillClassification.js BillClassification throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.BillClassification()
    })
    done()
  })

  test('BillClassification.js BillClassification accepts 3 string params, respectively', async (done) => {
    new Model.BillClassification('', '', '')
    done()
  })

  test('BillClassification.js TfIdfClassification throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.TfIdfClassification()
    })
    done()
  })

  test('BillClassification.js TfIdfClassification accepts a string and object param, respectively', async (done) => {
    new Model.TfIdfClassification('', {})
    done()
  })

  test('FinancialRecord.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.FinancialRecord()
    })
    done()
  })

  test('FinancialRecord.js accepts 3 strings and 3 numbers, respectively', async (done) => {
    new Model.FinancialRecord('', '', '', 0, 0, 0)
    done()
  })

  test('Politician.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.Politician()
    })
    done()
  })

  test('Politician.js accepts 3 strings and 3 numbers, and a string, respectively', async (done) => {
    new Model.Politician('', '', '', 0, 0, 0, '')
    done()
  })

  test('Riding.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.Riding()
    })
    done()
  })

  test('Riding.js accepts a number, two strings, and a number, respectively', async (done) => {
    new Model.Riding(0, '', '', 0)
    done()
  })

  test('Role.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.Role()
    })
    done()
  })

  test('Role.js accepts 3 strings, 2 numbers, and a string, respectively', async (done) => {
    new Model.Role('', '', '', 0, 0, '')
    done()
  })

  test('User.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.User()
    })
    done()
  })

  test('User.js accepts 6 strings and an object', async (done) => {
    new Model.User('', '', '', '', '', '', {})
    done()
  })

  test('Vote.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.Vote()
    })
    done()
  })

  test('Vote.js accepts two strings and two booleans, respectively', async (done) => {
    new Model.Vote('', '', true, true)
    done()
  })

  test('VoteRecord.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.VoteRecord()
    })
    done()
  })

  test('VoteRecord.js accepts 3 strings and 5 numbers', async (done) => {
    new Model.VoteRecord('', 0, 0, '', 0, '', 0, 0)
    done()
  })

  test('Description.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.Description()
    })
    done()
  })

  test('Description.js accepts 2 strings', async (done) => {
    new Model.Description('', '')
    done()
  })

  test('LegislativeActivity.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.LegislativeActivity()
    })
    done()
  })

  test('LegislativeActivity.js accepts 5 strings', async (done) => {
    new Model.LegislativeActivity('', '', '', '', '')
    done()
  })

  test('Party.js throws when passed bad params', async (done) => {
    Assert.throws(() => {
      new Model.PoliticalParty()
    })
    done()
  })

  test('Party.js accepts a string, a number and a string, respectively', async (done) => {
    new Model.PoliticalParty('', 0, '')
    done()
  })
})
