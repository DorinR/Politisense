/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const Vertex = require('../../../util/graph/Vertex').Vertex
const TypeVertex = require('../../../util/graph/Vertex').TypeVertex

describe('Vertex.js', () => {
  test('Vertex.js defaults to vertex and a function', () => {
    const v = new Vertex()
    Assert.equal(v.data, 'Vertex')
  })

  test('TypeVertex.js defaults to vertex and a type parameter', () => {
    const v = new TypeVertex('name', 'type')
    Assert.equal(v.data, 'type')
    Assert.equal(v.type, 'name')
  })
})
