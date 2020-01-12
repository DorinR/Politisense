/* eslint-env jest */
const Firestore = require('../Firebase').Firestore
const FinancialRecord = require('../models/FinancialRecord').FinancialRecord
const Politician = require('../models/Politician').Politician

const chai = require('chai')
chai.should()

describe('All firebase tests', () => {
  let fb
  beforeAll(() => {
    fb = new Firestore()
  })

  let fr, mp
  beforeEach(() => {
    fr = new FinancialRecord('', '', '', 0, 0, 0)
    mp = new Politician('', '', '', 0, '')
  })

  afterAll(async () => {
    await fb.close()
  })

  test('Can insert and delete a record', async (done) => {
    await fb.Bill().insert({ id: 'a' })
      .then(resp => {
        resp.should.equal(true)
      })
    await fb.Bill()
      .where('id', '==', 'a')
      .delete()
      .then(count => {
        count.should.equal(1)
      })
    done()
  })

  test('can filter records (legacy)', async (done) => {
    const didFilter = await fb.Bill()
      .select('id', '==', 8062279)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    didFilter.should.equal(true)
    done()
  })

  test('can filter records (use this)', async (done) => {
    const didFilter = await fb.Bill()
      .where('id', '==', 8062279)
      .select()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    didFilter.should.equal(true)
    done()
  })

  test('can update a record', async (done) => {
    await fb.Bill().insert({ id: 'a' })
      .then(resp => {
        resp.should.equal(true)
      })
    await fb.Bill().insert({ id: 'b' })
      .then(resp => {
        resp.should.equal(true)
      })
    await fb.Bill()
      .where('id', '==', 'a')
      .update({ id: 'b' })
      .then(count => {
        count.should.equal(true)
      })
    await fb.Bill()
      .where('id', '==', 'b')
      .delete().then(count => {
        count.should.equal(2)
      })
    done()
  }, 600000)

  test('Firestore::innerJoin() throws on bad first table key', async (done) => {
    const finances = fb.FinancialRecord()
    const mps = fb.Politician()
    const didThrow =
      await finances.innerJoin('_', mps, '_id')
        .then(() => {
          return false
        })
        .catch(() => {
          return true
        })
    didThrow.should.equal(true)
    done()
  }, 60000)

  test('Firestore::innerJoin() throws on bad second table key', async (done) => {
    const finances = fb.FinancialRecord()
    const mps = fb.Politician()
    const didThrow =
      await finances.innerJoin('_', mps, '_id')
        .then(() => {
          return false
        })
        .catch(() => {
          return true
        })
    didThrow.should.equal(true)
    done()
  }, 60000)

  test('Reference::innerJoin() provides joined collections as array', async (done) => {
    const finances = fb.FinancialRecord()
    const mps = fb.Politician()
    const records = await finances.innerJoin('member', mps, '_id')
    records.length.should.equal(9234)
    const record = records[0]
    Object.keys(record).length.should.equal(2 + Object.keys(fr).length + Object.keys(mp).length)
    Object.keys(record).should.deep.equal([
      'amount',
      'category',
      'member',
      'parent',
      'quarter',
      'year',
      '_id_financialRecord',
      'imageUrl',
      'name',
      'politicalParty',
      'riding',
      'yearElected',
      '_id_politicians'])
    record.member.should.equal(record._id_politicians)
    done()
  }, 60000)
})
