const Model = require('./Model').Model
const Condition = require('../../util/Condition').Condition

class ActivityVote extends Model {
  constructor (user, activity) {
    super()
    Condition.parameter(user).isType(String)
    Condition.parameter(activity).isType(String)

    this.user = user
    this.activity = activity
  }

  static deserialise (json) {
    return Model.deserialise(json, new ActivityVote('', ''))
  }
}

module.exports.ActivityVote = ActivityVote
