/* eslint-env jest */
const Firestore = require('../../firebase/Firestore').Firestore
const Reference = require('../../firebase/Reference').Reference

const chai = require('chai')
const Assert = chai.assert

describe('Firestore.js', () => {
  let undertest
  beforeEach(() => {
    undertest = new Firestore()
  })

  test('Firestore.js always created with static firestore attribute', () => {
    const db = new Firestore()
    Assert.equal(undertest.firestore, db.firestore)
  })

  test('Firestore.js::forParliament', () => {
    undertest.forParliament(1337)
    Assert.equal(undertest.parliament, 1337)
  })

  test('Firestore.js is currently not in legacy mode', () => {
    Assert(!undertest.legacy)
  })

  test('Firestore.js::createReference returns a reference instance', () => {
    const ret = undertest.createReference('some/collection/ref')
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::Bill returns a valid reference', () => {
    const ret = undertest.Bill()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::Bill returns a valid reference', () => {
    const ret = undertest.BillClassification()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::FinancialRecord returns a valid reference', () => {
    const ret = undertest.FinancialRecord()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::Politician returns a valid reference', () => {
    const ret = undertest.Politician()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::Riding returns a valid reference', () => {
    const ret = undertest.Riding()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::Role returns a valid reference', () => {
    const ret = undertest.Role()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::TfIdfClassification returns a valid reference', () => {
    const ret = undertest.TfIdfClassification()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::User returns a valid reference', () => {
    const ret = undertest.User()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::Vote returns a valid reference', () => {
    const ret = undertest.Vote()
    Assert(ret instanceof Reference)
  })

  test('Firestore.js::VoteRecord returns a valid reference', () => {
    const ret = undertest.VoteRecord()
    Assert(ret instanceof Reference)
  })
})
