const Condition = require('../../util/Condition').Condition
const Model = require('./Model').Model

class Vote extends Model {
  constructor (memberId, voteId, vote, paired) {
    super()
    Condition.parameter(memberId).isType(String)
    Condition.parameter(voteId).isType(String)
    Condition.parameter(vote).isType(Boolean)
    Condition.parameter(paired).isType(Boolean)

    this.member = memberId
    this.vote = voteId
    this.yea = vote
    this.paired = paired
  }

  static deserialise (json) {
    return Model.deserialise(json, new Vote('', '', false, false))
  }
}

module.exports.Vote = Vote
