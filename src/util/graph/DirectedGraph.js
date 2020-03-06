const Vertex = require('./Vertex').Vertex

class InvalidVertexError extends Error {
  constructor (message) {
    super()
    this.message = message
  }
}

class DirectedGraph {
  constructor () {
    this.adjacencyList = new Map()
  }

  addVertex (v) {
    DirectedGraph.check(v)
    this.adjacencyList.set(v, [])
  }

  addEdge (from, to) {
    DirectedGraph.check(from)
    DirectedGraph.check(to)
    const list = this.adjacencyList.get(from)
    if (!list) {
      throw new InvalidVertexError('Vertex from not in graph')
    }
    if (!this.adjacencyList.get(to)) {
      throw new InvalidVertexError('Vertex from not in graph')
    }
    list.push(to)
  }

  static check (v) {
    if (!(v instanceof Vertex)) {
      throw new InvalidVertexError('Vertex must be an instance of vertex')
    }
  }

  forEach (fn) {
    this.adjacencyList.forEach(fn)
  }

  get (v) {
    return this.adjacencyList.get(v)
  }
  //implements a BFS search for a euler walk
  static eulerWalk(graph, vert, first = true) {
    if(!vert) {
      return [] //base case for recursive function
    }
    const vertices = []
    let d = 0
    if(first){
      vertices.push({
        vertex: vert,
        depth: d
      })
    } else {
      let {vertex, depth} = vert
      vert = vertex
      d = depth
    }

    graph.get(vert).forEach(v => {
      vertices.push({
        vertex: v,
        depth: d + 1
      })
    })
    if(first) {
      vertices.slice(1).forEach(v => {
        vertices.push(...DirectedGraph.eulerWalk(graph, v, false))
      })
    } else {
      vertices.forEach(v => {
        vertices.push(...DirectedGraph.eulerWalk(graph, v, false))
      })
    }

    return vertices
  }
}

module.exports = {
  DirectedGraph: DirectedGraph,
  InvalidVertexError: InvalidVertexError
}
