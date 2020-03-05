const DirectedGraph = require('./DirectedGraph').DirectedGraph

class UndirectedGraph extends DirectedGraph {
  addEdge (v, w) {
    super.addEdge(v,w)
    this.adjacencyList.get(w).push(v)
  }
}

module.exports = {
  UndirectedGraph: UndirectedGraph
}
