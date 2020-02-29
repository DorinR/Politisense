const Vote = require('../Vote').Vote

class VoteParticipantBuilder {
  constructor (id) {
    this.id = id
  }

  withMember (name) {
    this.name = name
    return this
  }

  withYea (yea) {
    this.yea = yea
    return this
  }

  withPaired (paired) {
    this.paired = paired
    return this
  }

  build () {
    return new Vote(this.name, this.id, this.yea, this.paired)
  }
}

module.exports.VoteParticipantBuilder = VoteParticipantBuilder
