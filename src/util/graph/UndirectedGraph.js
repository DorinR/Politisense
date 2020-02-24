class Vertex {
  constructor (datum) {
    this.datum = datum
  }
}

//undirected graph implementation
class UndirectedGraph {
  constructor() {
    this.adjacencyList = new Map()
  }

  addVertex(v) {
    if (!(v instanceof Vertex)) {
      throw new Error('Vertex must be an instance of vertex')
    }
    this.adjacencyList.set(v, [])
  }

  addEdge(v, w) {
    if (!(v instanceof Vertex) || !(w instanceof Vertex)) {
      throw new Error('Vertices must be an instance of vertex')
    }
    this.adjacencyList.get(v).push(...[v, w])
  }
}

module.exports = {
  UndirectedGraph: UndirectedGraph,
  Vertex: Vertex
}