require('module-alias/register')
const Graph = require('@graph').DirectedGraph
const TypeVertex = require('@graph').Vertex.TypeVertex

const Data = require('@data')
const Scrapers = Data.Scrapers
const Runners = Data.Runners
const Actions = require('@action')
const Parameters = require('@parameter')

const Firestore = require('@firestore').Firestore
const db = new Firestore(false)

const Links = {
  bill: {
    url: 'https://www.parl.ca/LegisInfo/Home.aspx',
    collection: db.Bill
  },
  politician: {
    url:'https://www.ourcommons.ca/Members/en/search/xml',
    collection: db.Politician
  },
  role: {
    url: 'https://www.ourcommons.ca/Members/en/search',
    collection: db.Role
  },
  vote: {
    url: 'https://www.ourcommons.ca/Members/en/votes/xml',
    collection: db.VoteRecord
  },
  voter: {
    url: 'https://www.ourcommons.ca/Members/en/votes',
    collection: db.Vote
  },
  raw: {
    url: 'nil',
    collection: db.TfIdfClassification
  },
  classification: {
    url: 'nil',
    collection: db.BillClassification
  }
}
Object.freeze(Links)

const RegisteredVertices = {
  bills: new TypeVertex(Scrapers.BillScraper.BillScraper, Links.bill),
  politicians: new TypeVertex(Scrapers.PoliticianScraper.PoliticianScraper, Links.politician),
  vote_records: new TypeVertex(Scrapers.VoteScraper.VoteScraper, Links.vote),
  voters: new TypeVertex(Scrapers.VoteParticipantScraper.VoteParticipantScraper, Links.voter),

  classifications: new TypeVertex(Runners.CategoryRunner, Links.classification),
  raw: new TypeVertex(Runners.ClassificationRunner, Links.raw),
  roles: new TypeVertex(Scrapers.RoleScraper.RoleScraper, Links.role),

  //finances: new TypeVertex('finances'),
  //parties: new TypeVertex('parties'),

  root: new TypeVertex('root', 'nil'),
  leaf: new TypeVertex('leaf', 'nil')
}
Object.freeze(RegisteredVertices)

class UpdateDependencyGraph extends Graph {
  constructor () {
    super()
    this.addVertices()
    this.addEdges()
  }

  addVertices () {
    Object.keys(RegisteredVertices).forEach(key => {
      this.addVertex(RegisteredVertices[key])
    })
  }

  addEdges () {
    this.forEach((adj, v) => {
      if (v.type === 'root') {

        this.addEdge(v, RegisteredVertices.politicians)
        this.addEdge(v, RegisteredVertices.bills)

      } else if (v.type === Scrapers.BillScraper.BillScraper) {

        this.addEdge(v, RegisteredVertices.raw)
        this.addEdge(v, RegisteredVertices.vote_records)

      } else if (v.type === Runners.ClassificationRunner) {

        this.addEdge(v, RegisteredVertices.classifications)

      } else if (v.type === Scrapers.PoliticianScraper.PoliticianScraper) {

        this.addEdge(v, RegisteredVertices.roles)
        //this.addEdge(v, RegisteredVertices.finances)
        this.addEdge(v, RegisteredVertices.voters)
        //this.addEdge(v, RegisteredVertices.parties)

      } else if (v.type === Scrapers.VoteScraper.VoteScraper) {

        this.addEdge(v, RegisteredVertices.voters)

      } else if (v.type !== 'leaf') {

        this.addEdge(v, RegisteredVertices.leaf)
      }
    })
  }

  orderedUpdates(start) {
    if(!RegisteredVertices[start]) {
      throw new Error(`ERROR: ${start} is not in the update dependency graph`)
    }
    start = RegisteredVertices[start]
    const cleaned = this.eulerWalkDepthFirst(start)
      .filter(removeUtilityTags)
      .sort(reverseDepthSort)
      .filter(removeDuplicates)
      .sort(depthSort)
    seen = {}
    return cleaned
  }
}

function removeUtilityTags (v) {
  return v.vertex.type !== Parameters.UpdateNode.All && v.vertex.type !== Parameters.UpdateNode.None
}

function depthSort (v, w) {
  if (v.depth < w.depth) return -1
  if (v.depth > w.depth) return 1
  return 0
}

function reverseDepthSort(v, w) {
  if (v.depth < w.depth) return 1
  if (v.depth > w.depth) return -1
  return 0
}
var seen = {}
function removeDuplicates (v) {
  return seen.hasOwnProperty(v.vertex.data.collection.name) ? false : (seen[v.vertex.data.collection.name] = true)
}

module.exports = {
  UpdateDependencyGraph: UpdateDependencyGraph,
}
