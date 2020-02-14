const Firestore = require('@firestore').Firestore
const Utils = require('./util/DataUtil')

const IndexDirector = {
  Bills: {
    raw: rawClassifications,
    classifications: derivedClassifications,
    records: billRecords
  },

  Politicians: {
    records: politicianRecords,
    roles: politicianRoles,
    financials: politicianFinancials,
  },

  Votes: {
    records: voteRecords,
    voters: voters,
  },

  Ridings: {
    records: ridingRecords
  }
}

exports.index = (req, res) => {
  const type = req.params.type
  const category = req.params.category
  const parliament = req.params.parliament
  if(Utils.validate(type, category, parliament)) {
    error(res, 'No parameters passed to data API')
    return
  }
  try {
    IndexDirector[type][category](req, res)
  } catch (e) {
    console.log(e.message)
    Utils.error(res, 'Invalid Parameters passed to data API')
  }
}

async function rawClassifications (req, res) {
  const db = new Firestore(false).forParliament(req.params.parliament)
  const raws = db.TfIdfClassification()
  const bills = db.Bill()

  let data = await bills.innerJoin('_id', raws, 'bill')
  data = data.map(datum => {
    return {
      id: datum.id,
      number: datum.number,
      title: datum.title,
      text: datum.text,
      link: datum.link,
      dateVoted: datum.dateVoted,
      sponsorName: datum.sponsorName,
      raw: datum.raw,
    }
  })
  Utils.success(res, data, 'Bill Data with Raw TF-IDF Classifications')
}

async function derivedClassifications (req, res) {
  const db = new Firestore(false).forParliament(req.params.parliament)
  const tags = db.BillClassification()
  const bills = db.Bill()

  let data = await bills.innerJoin('_id', tags, 'bill')
  data = data.map(datum => {
    return {
      id: datum.id,
      number: datum.number,
      title: datum.title,
      text: datum.text,
      link: datum.link,
      dateVoted: datum.dateVoted,
      sponsorName: datum.sponsorName,
      category: datum.category,
    }
  })
  success(res, data, 'Bill Data with Derived Classifications')
}

async function billRecords (req, res) {
  const bills = new Firestore(false)
    .forParliament(req.params.parliament)
    .Bill()
  const data = await records(bills)
  success(res, data, 'Bill Records')
}

async function politicianRecords (req, res) {
  const politicians = new Firestore(false)
    .forParliament(req.params.parliament)
    .Politician()
  const data = await Utils.records(politicians)
  Utils.success(res, data, 'Politician Records')
}

async function politicianRoles (req, res) {
  const db = new Firestore(false).forParliament(req.params.parliament)
  const politicians = db.Politician()
  const roles = db.Role()

  let data = await politicians.innerJoin('_id', roles, 'politician')
  data = data.map(datum => {
    return {
      name: datum.name,
      party: datum.party,
      electedTo: datum.start,
      electedFrom: datum.end !== 0 ? datum.end : 'current',
      roleTo: datum.fromDate,
      roleFrom: datum.toDate !== 0 ? datum.toDate : 'current',
      riding: datum.riding,
      imageUrl: datum.imageUrl,
      group: datum.group,
      title: datum.title,
      type: datum.type,
    }
  })
  Utils.success(res, data, 'Politician Data with Roles')
}

async function politicianFinancials (req, res) {
  const db = new Firestore(false).forParliament(req.params.parliament)
  const politicians = db.Politician()
  const financials = db.FinancialRecord()

  let data = await politicians.innerJoin('_id', financials, 'member')
  data = data.map(datum => {
    return {
      name: datum.name,
      party: datum.party,
      electedTo: datum.start,
      electedFrom: datum.end !== 0 ? datum.end : 'current',
      riding: datum.riding,
      imageUrl: datum.imageUrl,
      amount: datum.amount,
      category: datum.category,
      parent: datum.parent,
      quarter: datum.quarter,
      year: datum.year
    }
  })
  Utils.success(res, data, 'Politician Data with Financial Records')
}

async function voteRecords (req, res) {
  const voteRecords = new Firestore(false)
    .forParliament(req.params.parliament)
    .VoteRecord()
  const data = await Utils.records(voteRecords)
  Utils.success(res, data, 'Vote Records')
}

async function voters (req, res) {
  const db = new Firestore(false).forParliament(req.params.parliament)
  const voteRecords = db.VoteRecord()
  const voters = db.Vote()
  const politicians = db.Politician()

  let data = await voteRecords
    .innerJoin('_id', voters, 'vote')
    .innerJoin('_id', politicians, 'member')

  data = data.map(datum => {
    return {
      name: datum.name,
      party: datum.party,
      electedTo: datum.start,
      electedFrom: datum.end !== 0 ? datum.end : 'current',
      riding: datum.riding,
      imageUrl: datum.imageUrl,
      yea: datum.yea,
      paired: datum.paired,
      id: datum.id,
      number: datum.billNumber,
      assent: datum.assent,
      yeas: datum.yeas,
      nays: datum.nays,
      bill: datum[`name_${voteRecords.reference.id}`]
    }
  })
  Utils.success(res, data, 'Politician Data with Financial Records')
}

async function ridingRecords (req, res) {
  const ridings = new Firestore(false)
    .forParliament(req.params.parliament)
    .Riding()
  const data = await Utils.records(ridings)
  Utils.success(res, data, 'Riding Records')
}

exports.update = (req, res) => {

}