// ABC for Firebase
class Model {
  constructor () {
    this.name = 'Model'
  }

  static serialise(model) {
    return JSON.parse(JSON.stringify(model))
  }

}

export { Model }
