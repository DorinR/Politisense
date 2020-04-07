/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const DirectedGraph = require('../../../util/graph/DirectedGraph').DirectedGraph
const InvalidVertexError = require('../../../util/graph/DirectedGraph').InvalidVertexError
const UndirectedGraph = require('../../../util/graph/UndirectedGraph').UndirectedGraph
const Vertex = require('../../../util/graph/Vertex').Vertex

describe('Graphs', () => {
  describe('DirectedGraph.js', () => {
    let vertex
    let graph
    beforeEach(() => {
      vertex = new Vertex()
      graph = new DirectedGraph()
    })

    test('DirectedGraph.js uses an adjacency map', () => {
      Assert(graph.adjacencyList instanceof Map)
    })

    test('DirectedGraph.js::addVertex throws when not vertex', () => {
      try {
        graph.addVertex({})
        Assert.fail()
      } catch (e) {
        if (e instanceof chai.AssertionError) {
          throw e
        }
        if (!(e instanceof InvalidVertexError)) {
          Assert.fail()
        }
      }
    })

    test('DirectedGraph.js::addVertex adds valid vertex', () => {
      graph.addVertex(vertex)
      Assert(graph.adjacencyList.has(vertex))
    })

    test('DirectedGraph.js::addEdge throws on invalid from vertex', () => {
      try {
        graph.addEdge({}, vertex)
        Assert.fail()
      } catch (e) {
        if (e instanceof chai.AssertionError) {
          throw e
        }
        if (!(e instanceof InvalidVertexError)) {
          Assert.fail()
        }
      }
    })

    test('DirectedGraph.js::addEdge throws on invalid to vertex', () => {
      try {
        graph.addEdge(vertex, {})
        Assert.fail()
      } catch (e) {
        if (e instanceof chai.AssertionError) {
          throw e
        }
        if (!(e instanceof InvalidVertexError)) {
          Assert.fail()
        }
      }
    })

    test('DirectedGraph.js::addEdge when from vertex not in graph', () => {
      try {
        graph.addEdge(vertex, new Vertex())
        Assert.fail()
      } catch (e) {
        if (e instanceof chai.AssertionError) {
          throw e
        }
        if (!(e instanceof InvalidVertexError)) {
          Assert.fail()
        }
      }
    })

    test('DirectedGraph.js::addEdge when to vertex not in graph', () => {
      try {
        graph.addVertex(vertex)
        graph.addEdge(vertex, new Vertex())
        Assert.fail()
      } catch (e) {
        if (e instanceof chai.AssertionError) {
          throw e
        }
        if (!(e instanceof InvalidVertexError)) {
          Assert.fail()
        }
      }
    })

    test('DirectedGraph.js::addEdge adds to vertex to adjacencies of from vertex', () => {
      const to = new Vertex()
      graph.addVertex(vertex)
      graph.addVertex(to)
      graph.addEdge(vertex, to)
      const adjacencies = graph.get(vertex)
      Assert.isOk(adjacencies)
      Assert(adjacencies.includes(to))
    })

    test('DirectedGraph.js::forEach iterates over adjacency list', () => {
      const tags = ['a', 'b', 'c']
      graph.addVertex(new Vertex(tags[0]))
      graph.addVertex(new Vertex(tags[1]))
      graph.addVertex(new Vertex(tags[2]))

      let count = 0
      graph.forEach((adj, v) => {
        Assert.equal(v.data, tags[count++])
      })
    })

    test('DirectedGraph.js::eulerWalkDepth first returns vertices by depth', () => {
      const vertices = new Array(10)
        .fill({}, 0, 10)
        .map(i => {
          return new Vertex()
        })
      vertices.forEach((v, i) => {
        graph.addVertex(v)
      })
      vertices.forEach((v, i) => {
        if (i < vertices.length - 1) {
          graph.addEdge(v, vertices[i + 1])
        }
      })

      const orderedVertices = graph.eulerWalkDepthFirst(vertices[0])
      let count = 0
      orderedVertices.forEach((v, i) => {
        Assert.equal(count++, i)
        Assert(v.vertex instanceof Vertex)
      })
    })

    test('DirectedGraph.js::eulerWalkDepth returns empty array if falsy value passed', () => {
      const ret = graph.eulerWalkDepthFirst()
      Assert(ret instanceof Array)
      Assert.equal(ret.length, 0)
    })
  })

  describe('UndirectedGraph.js', () => {
    let vertex
    let graph
    beforeEach(() => {
      vertex = new Vertex()
      graph = new UndirectedGraph()
    })

    test('UndirectedGraph.js::addEdge adds undirected edge', () => {
      const to = new Vertex()
      graph.addVertex(vertex)
      graph.addVertex(to)
      graph.addEdge(vertex, to)
      Assert(graph.get(vertex).includes(to))
      Assert(graph.get(to).includes(vertex))
    })
  })
})
