require('module-alias/register')
const Graph = require('@utils').Graphs.DirectedGraph
const Vertex = require('@utils').Graphs.Vertex

const RegisteredVertices = {
  bills: new Vertex('bills'),
  politicians: new Vertex('politicians'),
  vote_records: new Vertex('vote_records'),
  voters: new Vertex('voters'),

  classifications: new Vertex('classifications'),
  raw: new Vertex('raw'),
  roles: new Vertex('roles'),
  finances: new Vertex('finances'),

  parties: new Vertex('parties'),
  root: new Vertex('root'),
  leaf: new Vertex('leaf', () => {
    console.log('INFO: leaf node reached, no further dependencies')
  })
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
      if (v.tag === 'root') {
        this.addEdge(v, RegisteredVertices.politicians)
        this.addEdge(v, RegisteredVertices.bills)
      } else if (v.tag === 'bills') {
        this.addEdge(v, RegisteredVertices.raw)
        this.addEdge(v, RegisteredVertices.vote_records)
      } else if (v.tag === 'raw') {
        this.addEdge(v, RegisteredVertices.classifications)
      } else if (v.tag === 'politicians') {
        this.addEdge(v, RegisteredVertices.roles)
        this.addEdge(v, RegisteredVertices.finances)
        this.addEdge(v, RegisteredVertices.voters)
        this.addEdge(v, RegisteredVertices.parties)
      } else if (v.tag === 'vote_records') {
        this.addEdge(v, RegisteredVertices.voters)
      } else if (v.tag !== 'leaf') {
        this.addEdge(v, RegisteredVertices.leaf)
      }
    })
  }

  orderedUpdates(start) {
    if(RegisteredVertices[start]) {
      start = RegisteredVertices[start]
    }
    let orderedUpdates = Graph.eulerWalk(this, start)
    orderedUpdates = orderedUpdates.filter(vertex => {
      return vertex.vertex !== RegisteredVertices.leaf
      })
    for(let i = 0; i < orderedUpdates.length; i++) {
      for(let j = i + 1; j < orderedUpdates.length; j++) {
        if(orderedUpdates[i].vertex.tag === orderedUpdates[j].vertex.tag) {
          orderedUpdates.splice(i,1)
        }
      }
    }
    orderedUpdates.shift()
    return orderedUpdates
  }
}

module.exports = {
  UpdateDependencyGraph: UpdateDependencyGraph
}

console.log(new UpdateDependencyGraph().orderedUpdates('root'))