// ABC for Firebase
class Model {
  constructor () {
    this.name = 'Model'
  }

  static serialise (model) {
    return JSON.parse(JSON.stringify(model))
  }

  static deserialise (json, proto) {
    Object.keys(json).forEach(key => {
      if (!Object.keys(proto).has(key)) {
        throw new TypeError('ERROR: malformed json does not contain correct attribute:' + key)
      }
      if(typeof proto[key] !== typeof json[key]) {
        throw new TypeError(`ERROR: malformed json attribute: ${key} has type: ${typeof json[key]}, requires ${typeof proto[key]}`)
      }
      proto[key] = json[key]
    })
    return proto
  }

}

export { Model }
