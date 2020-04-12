require('module-alias/register')
const Firestore = require('@firestore').Firestore
const Utils = require('./util/DataUtil')
const flatten = require('flat')
const Parameters = require('@parameter').UpdateNode
const Auth = require('@firestore').Authentication

const IndexDirector = {
  Bills: {
    raw: rawClassifications,
    classifications: derivedClassifications,
    records: billRecords
  },

  Politicians: {
    records: politicianRecords,
    roles: politicianRoles,
    financials: politicianFinancials
  },

  Votes: {
    records: voteRecords,
    voters: voters
  },

  Ridings: {
    records: ridingRecords
  }
}
Object.freeze(IndexDirector)

exports.index = (req, res) => {
  const type = req.params.type
  const category = req.params.category
  const parliament = req.params.parliament
  if (Utils.validate(type, category, parliament)) {
    Utils.error(res, 'No parameters passed to data API')
    return
  }
  try {
    IndexDirector[type][category](req, res)
  } catch (e) {
    console.error(e.message)
    Utils.error(res, 'Invalid Parameters passed to data API')
  }
}

async function rawClassifications(req, res) {
  const db = new Firestore().forParliament(req.params.parliament)
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
      raw: datum.raw
    }
  })
  Utils.success(res, data, 'Bill Data with Raw TF-IDF Classifications')
}

async function derivedClassifications(req, res) {
  const db = new Firestore().forParliament(req.params.parliament)
  const tags = db.BillClassification()
  const bills = db.Bill()

  let data = await bills.innerJoin('_id', tags, 'bill')
  data = data
    .map(datum => {
      return {
        id: datum.id,
        number: datum.number,
        title: datum.title,
        text: datum.text,
        link: datum.link,
        dateVoted: datum.dateVoted,
        sponsorName: datum.sponsorName,
        category: datum.category
      }
    })
  Utils.success(res, data, 'Bill Data with Derived Classifications')
}

async function billRecords(req, res) {
  const bills = new Firestore()
    .forParliament(req.params.parliament)
    .Bill()
  const data = await Utils.records(bills)
  Utils.success(res, data.map(datum => { return datum.data }), 'Bill Records')
}

async function politicianRecords(req, res) {
  const politicians = new Firestore(false)
    .forParliament(req.params.parliament)
    .Politician()
  const data = await Utils.records(politicians)
  Utils.success(res, data.map(datum => { return datum.data }), 'Politician Records')
}

async function politicianRoles(req, res) {
  const db = new Firestore(false).forParliament(req.params.parliament)
  const politicians = db.Politician()
  const roles = db.Role()

  let data = await politicians.innerJoin('_id', roles, 'politician')
  data = data
    .map(datum => {
      return {
        name: datum.name,
        party: datum.party,
        electedFrom: datum.start,
        electedTo: datum.end !== 0 ? datum.end : 'current',
        roleFrom: datum.fromDate,
        roleTo: datum.toDate !== 0 ? datum.toDate : 'current',
        riding: datum.riding,
        imageUrl: datum.imageUrl,
        group: datum.group,
        title: datum.title,
        type: datum.type
      }
    })
  Utils.success(res, data, 'Politician Data with Roles')
}

async function politicianFinancials(req, res) {
  const db = new Firestore()
    .forParliament(req.params.parliament)
    .atYear(req.body.year)
  const politicians = db.Politician()
  const financials = db.FinancialRecord()

  let data = await politicians.innerJoin('_id', financials, 'member')
  data = data.map(datum => {
    return {
      name: datum.name,
      party: datum.party,
      electedFrom: datum.start,
      electedTo: datum.end !== 0 ? datum.end : 'current',
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

async function voteRecords(req, res) {
  const voteRecords = new Firestore(false)
    .forParliament(req.params.parliament)
    .VoteRecord()
  const data = await Utils.records(voteRecords)
  Utils.success(res, data.map(datum => { return datum.data }), 'Vote Records')
}

async function voters(req, res) {
  const db = new Firestore(false).forParliament(req.params.parliament)
  const voteRecords = db.VoteRecord()
  const voters = db.Vote()

  const promises = await Promise.all([
    Utils.records(db.Politician()),
    voteRecords.innerJoin('_id', voters, 'vote')
  ])
  const politicians = promises[0]
  const members = {}
  politicians.forEach(politician => {
    members[`${politician.id}`] = politician.data
  })
  let data = promises[1]
  data = data
    .filter(datum => {
      return Object.keys(members).includes(datum.member)
    })
  data = data.map(datum => {
    return {
      name: members[datum.member].name,
      party: members[datum.member].party,
      electedTo: members[datum.member].start,
      electedFrom: members[datum.member].end !== 0 ? members[datum.member].end : 'current',
      riding: members[datum.member].riding,
      imageUrl: members[datum.member].imageUrl,
      yea: datum.yea,
      paired: datum.paired,
      id: datum.id,
      number: datum.billNumber,
      assent: datum.assent,
      yeas: datum.yeas,
      nays: datum.nays
    }
  })
  Utils.success(res, data, 'Politician Data with Voting Records')
}

async function ridingRecords(req, res) {
  const ridings = new Firestore(false)
    .forParliament(req.params.parliament)
    .Riding()
  const data = await Utils.records(ridings)
  Utils.success(res, data.map(datum => { return datum.data }), 'Riding Records')
}

const UpdateDirector = {
  Bills: {
    raw: Parameters.TfIdf,
    classifications: Parameters.Category,
    records: Parameters.Bill
  },

  Politicians: {
    records: Parameters.Politician,
    roles: Parameters.Role,
    finances: Parameters.Finance
  },

  Parties: {
  },

  Root: {
    records: Parameters.All
  },

  Votes: {
    records: Parameters.Vote,
    voters: Parameters.Voter
  },

  Ridings: {
  }
}
Object.freeze(UpdateDirector)

exports.update = async (req, res) => {
  const auth = new Auth()
  const db = new Firestore()

  if (!req.body.email || !req.body.password) {
    Utils.error(res, 'Authentication Failed', 401)
    return
  }

  const admins = db.Admin().where('email', '==', req.body.email)
  let admin = await Utils.records(admins)
  admin = admin[0].data

  if (!auth.compare(`${req.body.password}${admin.random}`, admin.password)) {
    Utils.error(res, 'Authentication Failed', 401)
    return
  }

  const type = req.params.type
  const category = req.params.category
  const parliament = req.params.parliament

  if (Utils.validate(type, category, parliament)) {
    Utils.error(res, 'No parameters passed to data API for updating')
    return
  }

  if (admin.updating) {
    Utils.error(res, 'Currently Updating collections, cannot start another update', 401)
    return
  } else {
    await db.Admin().where('email', '==', req.body.email).update({ updating: true })
  }

  let root = Parameters.None
  try {
    root = UpdateDirector[type][category]
    if (!Object.values(flatten(Parameters)).includes(root)) {
      throw new Error('Invalid update parameter passed')
    }
  } catch (e) {
    console.error(e.message)
    Utils.error(res, 'Invalid Parameters passed to data API for updating')
    return
  }
  updateFromProvidedNode(root, process.env)
    .then(code => {
      console.log(`INFO: update process exited with code: ${code}`)
      console.log('INFO: removing update lock')
    })
    .catch(e => {
      console.error(e)
    })
    .finally(async () => {
      await db.Admin().where('email', '==', req.body.email).update({ updating: false })
    })
  Utils.success(res, {
    dependencies: root
  }, `Successfully started update at ${root} node on server`)
}

const child = require('child_process')

async function updateFromProvidedNode(root, opts) {
  const opt = Object.create(opts)
  opts.NODE_OPTIONS = '--max-old-space-size=16384'
  return new Promise((resolve, reject) => {
    const process = child.fork('src/data/update/UpdateScript.js', opt)
    process.send({ node: root })
    process.on('error', (err) => {
      reject(err)
    })
    process.on('close', (code) => {
      resolve(code)
    })
  })
}
