const Model = require('./model/models').Model

class Reference {
  constructor (reference, refString) {
    this.reference = reference
    this.modelsOnly = false
    this.query = null
    this.referenceString = refString
  }

  id () {
    return this.reference.id
  }

  hierarchy () {
    return this.referenceString.split('/')
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
    return new Promise((resolve, reject) => {
      this.reference
        .add(model)
        .then(result => {
          resolve(result.id)
        })
        .catch((e) => {
          console.error(e)
          reject(e)
        })
    })
  }

  async innerJoin (key, reference, refKey) {
    const left = {}
    const right = {}

    const fetch = (snapshot, container, suffix) => {
      snapshot.forEach(doc => {
        const data = doc.data()
        data[`_id${suffix}`] = doc.id
        container[doc.id] = data
      })
    }

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

    const join = []

    Object.keys(left).forEach(leftKey => {
      const leftDoc = left[leftKey]
      const leftKeys = Object.keys(leftDoc)
      if (!leftKeys.includes(key) && key !== `_id_${this.reference.id}`) {
        console.warn(
          `Current collection: ${this.reference.id} does not contain items with key: ${key} `
        )
      }
      Object.keys(right).forEach(rightKey => {
        const rightDoc = right[rightKey]
        const rightKeys = Object.keys(rightDoc)
        if (
          !rightKeys.includes(refKey) &&
          refKey !== `_id_${reference.reference.id}`
        ) {
          console.warn(
            `Current collection: ${reference.reference.id} does not contain items with key: ${refKey} `
          )
        }
        if (leftDoc[key] === rightDoc[refKey]) {
          const joined = {}
          leftKeys.forEach(k => {
            joined[k] = leftDoc[k]
          })
          rightKeys.forEach(k => {
            joined[k] = rightDoc[k]
          })
          join.push(joined)
        }
      })
    })
    return join
  }
}

module.exports.Reference = Reference
