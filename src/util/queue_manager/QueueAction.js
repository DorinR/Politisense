class QueueAction {
  perform () {
    throw new Error('ERROR: perform action not defined')
  }
}

module.exports.QueueAction = QueueAction
