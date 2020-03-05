/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const Vertex = require('../../../util/graph/Vertex').Vertex

describe('Vertex.js', () => {
  test('Vertex.js defaults to vertex and a function', () => {
    const v = new Vertex()
    Assert.equal(v.tag, 'Vertex')
  })
})
