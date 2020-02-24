const Graphs = require('./UndirectedGraph')
const UndirectedGraph = Graphs.UndirectedGraph
const Vertex = Graphs.Vertex

class DirectedGraph extends UndirectedGraph {

  addEdge (v, w) {
    if (!(v instanceof Vertex) || !(w instanceof Vertex)) {
      throw new Error('Vertices must be an instance of vertex')
    }
    this.adjacencyList.get(v).push(w)
  }
}

module.exports = {
  DirectedGraph: DirectedGraph,
  Vertex: Vertex
}