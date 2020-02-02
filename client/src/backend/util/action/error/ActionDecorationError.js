class ActionDecorationError extends Error {
  constructor (action, message) {
    super()
    if (!message) {
      message = `Tried to add action of type ${action.constructor.name}. It is not of Type Action.`
    }
    this.message = message
  }
}

module.exports.ActionDecorationError = ActionDecorationError