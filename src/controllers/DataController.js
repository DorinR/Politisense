require('module-alias/register')
const Firestore = require('@firestore').Firestore
const Utils = require('./util/DataUtil')
const Graph = require('@utils').Graphs.DirectedGraph
const Vertex = require('@utils').Graphs.Vertex

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
      id: datum.id_bill,
      number: datum.number_bill,
      title: datum.title_bill,
      text: datum.text_bill,
      link: datum.link_bill,
      dateVoted: datum.dateVoted_bill,
      sponsorName: datum.sponsorName_bill,
      raw: datum.raw_raw
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
      id: datum.id_bill,
      number: datum.number_bill,
      title: datum.title_bill,
      text: datum.text_bill,
      link: datum.link_bill,
      dateVoted: datum.dateVoted_bill,
      sponsorName: datum.sponsorName_bill,
      category: datum.category_tag
    }
  })
  Utils.success(res, data, 'Bill Data with Derived Classifications')
}

async function billRecords (req, res) {
  const bills = new Firestore(false)
    .forParliament(req.params.parliament)
    .Bill()
  const data = await Utils.records(bills)
  Utils.success(res, data, 'Bill Records')
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
      name: datum.name_politician,
      party: datum.party_politician,
      electedFrom: datum.start_politician,
      electedTo: datum.end_politician !== 0 ? datum.end_politician : 'current',
      roleFrom: datum.fromDate_role,
      roleTo: datum.toDate_role !== 0 ? datum.toDate_role : 'current',
      riding: datum.riding_politician,
      imageUrl: datum.imageUrl_politician,
      group: datum.group_role,
      title: datum.title_role,
      type: datum.type_role
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
      name: datum.name_politician,
      party: datum.party_politician,
      electedFrom: datum.start_politician,
      electedTo: datum.end_politician !== 0 ? datum.end_politician : 'current',
      riding: datum.riding_politician,
      imageUrl: datum.imageUrl_politician,
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
    .innerJoin('member_voter', politicians, '_id')

  data = data.map(datum => {
    return {
      name: datum.name_politician,
      party: datum.party_politician,
      electedTo: datum.start_politician,
      electedFrom: datum.end_politician !== 0 ? datum.end_politician : 'current',
      riding: datum.riding_politician,
      imageUrl: datum.imageUrl_politician,
      yea: datum.yea_voter,
      paired: datum.paired_voter,
      id: datum.id_vote_record,
      number: datum.billNumber_vote_record,
      assent: datum.assent_vote_record,
      yeas: datum.yeas_vote_record,
      nays: datum.nays_vote_record,
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

const UpdateDirector = {
  Bills: {
    raw: 'raw',
    classifications: 'classifications',
    records: 'bills'
  },

  Politicians: {
    records: 'politicians',
    roles: 'roles',
    ministers: 'ministers',
    financials: 'finances'
  },

  Parties: {
    records: 'parties'
  },

  Root: {
    records: 'root'
  },

  Votes: {
    records: 'vote_records',
    voters: 'voters'
  },

  Ridings: {
    records: 'ridings'
  }
}
Object.freeze(UpdateDirector)

exports.update = (req, res) => {
  const type = req.params.type
  const category = req.params.category
  const parliament = req.params.parliament
  if (Utils.validate(type, category, parliament)) {
    Utils.error(res, 'No parameters passed to data API for updating')
    return
  }
  try {
    req.params.root = UpdateDirector[type][category]
  } catch (e) {
    console.log(e.message)
    Utils.error(res, 'Invalid Parameters passed to data API for updating')
    return
  }
  const { graph, root } = createUpdateGraph(req, res)
  const dependencies = graph
    .get(root)
    .map(v => {
      return v.tag
    })
  Utils.success(res, {
    dependencies: dependencies
  }, 'stub')
}

function createUpdateGraph (req, res) {
  const graph = new Graph()
  const vertices = {
    bills: new Vertex('bills'),
    politicians: new Vertex('politicians'),
    vote_records: new Vertex('vote_records'),
    voters: new Vertex('voters'),

    classifications: new Vertex('classifications'),
    raw: new Vertex('raw'),
    roles: new Vertex('roles'),
    finances: new Vertex('finances'),

    parties: new Vertex('parties'),
    ridings: new Vertex('ridings'),
    ministers: new Vertex('ministers'),
    root: new Vertex('root'),

    leaf: new Vertex('leaf')
  }

  if (!Object.keys(vertices).includes(req.params.root)) {
    throw new Error('Invalid root specified for update graph')
  }

  Object.keys(vertices).forEach(key => {
    graph.addVertex(vertices[key])
  })

  graph.forEach((adj, v) => {
    if (v.tag === 'root') {
      graph.addEdge(v, vertices.politicians)
      graph.addEdge(v, vertices.bills)
    } else if (v.tag === 'bills') {
      graph.addEdge(v, vertices.raw)
      graph.addEdge(v, vertices.vote_records)
    } else if (v.tag === 'raw') {
      graph.addEdge(v, vertices.classifications)
    } else if (v.tag === 'politicians') {
      graph.addEdge(v, vertices.roles)
      graph.addEdge(v, vertices.finances)
      graph.addEdge(v, vertices.voters)
      graph.addEdge(v, vertices.parties)
    } else if (v.tag === 'vote_records') {
      graph.addEdge(v, vertices.voters)
    } else if (v.tag === 'roles') {
      graph.addEdge(v, vertices.ministers)
    } else if (v.tag !== 'leaf') {
      graph.addEdge(v, vertices.leaf)
    }
  })
  return {
    graph: graph,
    root: vertices[req.params.root]
  }
}
