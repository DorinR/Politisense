function validate(type, category, parliament) {
  return !type || !category || !parliament || parliament < 36 || parliament > 43
}

function error(res, message, status = 412) {
  res
    .status(status)
    .type('json')
    .json({
      success: false,
      data: {},
      message: message
    })
}

function success(res, data, message) {
  res
    .status(200)
    .type('json')
    .json({
      success: true,
      data: data,
      message: message
    })
}

function records(reference) {
  return new Promise((resolve, reject) => {
    reference
      .select()
      .then(snapshot => {
        if (snapshot.empty) {
          resolve([])
        } else {
          return snapshot
        }
      })
      .then(snapshot => {
        const res = []
        snapshot.forEach(doc => {
          res.push(doc.data())
        })
        resolve(res)
      })
      .catch(reject)
  })
}

module.exports = {
  validate: validate,
  error: error,
  records: records,
  success: success
}