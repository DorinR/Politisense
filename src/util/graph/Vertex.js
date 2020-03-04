class Vertex {
  constructor (tag = 'Vertex', fn = () => {}) {
    this.tag = tag
    this.fn = fn
  }
}

module.exports.Vertex = Vertex
