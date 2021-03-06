// ABC for Firebase
class Model {
  static serialise (model) {
    return JSON.parse(JSON.stringify(model))
  }

  static deserialise (json, proto) {
    if (Object.keys(json).length !== Object.keys(proto).length) {
      throw new TypeError('ERROR: malformed json does not contain correct number of attributes')
    }
    Object.keys(json).forEach(key => {
      if (!Object.keys(proto).includes(key)) {
        throw new TypeError('ERROR: malformed json does not contain correct attribute:' + key)
      }
      if (typeof proto[key] !== typeof json[key]) {
        throw new TypeError(`ERROR: malformed json attribute: ${key} has type: ${typeof json[key]}, requires ${typeof proto[key]}`)
      }
      proto[key] = json[key]
    })
    return proto
  }
}

module.exports.Model = Model
