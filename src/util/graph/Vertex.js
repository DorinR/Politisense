class Vertex {
  constructor (data = 'Vertex') {
    this.data = data
  }
}

class TypeVertex extends Vertex {
  constructor (type, data) {
    super(data)
    this.type = type
  }
}

module.exports = {
  Vertex: Vertex,
  TypeVertex: TypeVertex
}
