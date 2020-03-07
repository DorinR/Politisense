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
  static eulerWalk(graph, vertex) {
    if(!vertex) {
      return []
    }
    const vertices = [vertex]
    graph.get(vertex).forEach(v => {
      vertices.push(...DirectedGraph.eulerWalk(graph, v))
    })
    return vertices
  }
}

module.exports = {
  DirectedGraph: DirectedGraph,
  InvalidVertexError: InvalidVertexError
}
