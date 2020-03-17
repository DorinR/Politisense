const Model = require('./firebase').Models.Model

class Reference {
  constructor (reference) {
    this.reference = reference
    this.modelsOnly = false
    this.query = null
  }

  id () {
    return this.reference.id
  }

  where (attribute, operator, value) {
    if (!this.query) {
      this.query = this.reference.where(attribute, operator, value)
    }
    this.query = this.query.where(attribute, operator, value)
    return this
  }

  update (model) {
    if (this.modelsOnly && !(model instanceof Model)) {
      throw new Error('Error: Only a model can be updated in firebase')
    } else if (!this.modelsOnly && !(model instanceof Model)) {
      console.warn(
        'WARNING: Using non models for firestore is deprecated. Use Models instead.'
      )
    }
    if (model instanceof Model) {
      model = Model.serialise(model)
    }
    let ref = this.reference
    if (this.query) {
      ref = this.query
    }
    return new Promise((resolve, reject) => {
      ref
        .get()
        .then(snapshot => {
          const promises = []
          snapshot.forEach(doc => {
            promises.push(doc.ref.update(model))
          })
          return Promise.all(promises)
        })
        .then(() => {
          resolve(true)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  delete () {
    let ref = this.reference
    if (this.query) {
      ref = this.query
    }
    return new Promise((resolve, reject) => {
      ref
        .get()
        .then(async snapshot => {
          let count = 0
          const snapshotArray = []
          snapshot.forEach(doc => {
            snapshotArray.push(doc.ref)
          })
          await Promise.all(
            snapshotArray.map(ref => {
              return ref.delete().then(resp => {
                count++
              })
            })
          )
          resolve(count)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  select (attribute, operator, value) {
    let ref = this.reference.get.bind(this.reference)
    if (
      typeof attribute !== 'undefined' &&
      typeof operator !== 'undefined' &&
      typeof value !== 'undefined' &&
      this.query === null
    ) {
      console.warn(
        'WARNING: using select with parameters is a deprecated behaviour. Use where(..).select() instead.'
      )
      const query = this.reference.where(attribute, operator, value)
      ref = query.get.bind(query)
    } else if (this.query !== null) {
      ref = this.query.get.bind(this.query)
    }
    return new Promise((resolve, reject) => {
      ref()
        .then(snapshot => {
          resolve(snapshot)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  insert (model) {
    if (this.modelsOnly && typeof !(model instanceof Model)) {
      throw new Error('Error: Only a model can be inserted in firebase')
    } else if (!this.modelsOnly && !(model instanceof Model)) {
      console.warn(
        'WARNING: Using non models for firestore is deprecated. Use Models instead.'
      )
    }
    if (model instanceof Model) {
      model = Model.serialise(model)
    }
    return new Promise(resolve => {
      this.reference
        .add(model)
        .then(result => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

  async innerJoin (key, reference, refKey) {
    const left = {}
    const right = {}

    await this.select().then(snapshot => {
      fetch(snapshot, left, `_${this.reference.id}`)
    })
    await reference.select().then(snapshot => {
      fetch(snapshot, right, `_${reference.reference.id}`)
    })

    if (key === '_id') {
      key = `${key}_${this.reference.id}`
    }
    if (refKey === '_id') {
      refKey = `${refKey}_${reference.reference.id}`
    }

    return cartesianProduct(left, key, this.reference.id, right, refKey, reference.reference.id)
  }
}

class DataReference {
  constructor (data = []) {
    this.data = data || []
  }

  forEach (fn) {
    return this.data.forEach(fn)
  }

  map (fn) {
    return this.data.map(fn)
  }

  async innerJoin (key, reference, refKey) {
    const left = format(this.data)
    const right = {}

    if (key === '_id') {
      throw new Error('Ambiguous _id parameter for consecutive joins')
    } else {
      key = `${key}_prev`
    }
    if (refKey === '_id') {
      refKey = `${refKey}_${reference.reference.id}`
    }

    await reference.select().then(snapshot => {
      fetch(snapshot, right, `_${reference.reference.id}`)
    })
    return cartesianProduct(left, key, 'prev', right, refKey, reference.reference.id)
  }
}

function format (data, suffix) {
  const container = {}
  data.forEach(datum => {
    const obj = {}
    let count = 0
    Object.keys(datum).forEach(key => {
      const keys = key.split('_')
      obj[`${keys[0] === '' ? `_id${count++}` : keys[0]}_prev`] = datum[key]
    })
    for (let i = 0; i < count; i++) {
      container[obj[`_id${i}_prev`]] = Object.assign(obj)
    }
  })
  return container
}

function fetch (snapshot, container, suffix) {
  snapshot.forEach(doc => {
    const data = doc.data()
    data[`_id${suffix}`] = doc.id
    container[doc.id] = data
  })
}

function cartesianProduct (left, key, leftName, right, refKey, rightName) {
  const join = []

  Object.keys(left).forEach(leftKey => {
    const leftDoc = left[leftKey]
    const leftKeys = Object.keys(leftDoc)
    if (!leftKeys.includes(key)) {
      console.warn(
        `Current collection: ${this.reference ? this.reference.id : 'Joined Collection'}, contains items without key: ${key} `
      )
    }
    Object.keys(right).forEach(rightKey => {
      const rightDoc = right[rightKey]
      const rightKeys = Object.keys(rightDoc)
      if (
        !rightKeys.includes(refKey) &&
        refKey !== `_id_${rightName}`
      ) {
        console.warn(
          `Current collection: ${rightName} contains items without key: ${refKey} `
        )
      }
      if (leftDoc[key] === rightDoc[refKey]) {
        const joined = {}
        leftKeys.forEach(k => {
          if (rightKeys.includes(k) || k.includes('_id') || k.includes('_prev')) {
            joined[k] = leftDoc[k]
          } else {
            joined[`${k}_${leftName}`] = leftDoc[k]
          }
        })
        rightKeys.forEach(k => {
          if (leftKeys.includes(k) || k.includes('_id_')) {
            joined[k] = rightDoc[k]
          } else {
            joined[`${k}_${rightName}`] = rightDoc[k]
          }
        })
        join.push(joined)
      }
    })
  })
  return new DataReference(join)
}

module.exports = {
  Reference: Reference
}
