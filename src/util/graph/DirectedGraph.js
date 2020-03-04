const UndirectedGraph = require('./UndirectedGraph').UndirectedGraph
const Vertex = require('./Vertex').Vertex

class DirectedGraph extends UndirectedGraph {
  addEdge (v, w) {
    if (!(v instanceof Vertex) || !(w instanceof Vertex)) {
      throw new Error('Vertices must be an instance of vertex')
    }
    this.adjacencyList.get(v).push(w)
  }
}

module.exports = {
  DirectedGraph: DirectedGraph
}
