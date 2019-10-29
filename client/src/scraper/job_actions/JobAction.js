class AbstractJobAction {
  perform () {
    throw new TypeError('Function not overriden in base class')
  }
}

module.exports.AbstractJobAction = AbstractJobAction
