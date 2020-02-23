const Job = require('../util/Job').AbstractJob
const Actions = require('@action')
const FetchAction = Actions.FetchAction
const ErrorHandler = Actions.HandleConnectionErrorAction
const ParserAction = Actions.ParserWrapperAction
const VoteParser = require('@parser').VoteXmlParser
const VoteParticipantsXmlParser = require('@parser').VoteParticipantsXmlParser

class FormatAction extends Actions.Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    return {
      params: this.params,
      data: result
    }
  }
}

class DupeVotesFilterAction extends Actions.Action {
  async perform (result) {
    const filteredVotes = {}
    const votes = result[0]
    votes.forEach(vote => {
      if (vote.billNumber in filteredVotes) {
        const savedVoteId = filteredVotes[vote.billNumber].id
        if (vote.id > savedVoteId) {
          filteredVotes[vote.billNumber] = vote
        }
      } else {
        filteredVotes[vote.billNumber] = vote
      }
    })
    return Object.values(filteredVotes)
  }
}

class VotersAction extends Actions.Action {
  constructor (parliament) {
    super()
    this.parliament = parliament
  }

  async getVoters (voteId, parliament) {
    const voteUrl = VoteParser.getVoteParticipantsUrl(voteId, parliament)
    const xml = await this.getVoteHtml(voteUrl)
    return new VoteParticipantsXmlParser(xml).getAllFromXml()
  }

  async getVoteHtml (url) {
    return new FetchAction({ url: url }).perform()
      .then(html => { return html })
      .catch(e => {
        console.error(e.message)
        return ''
      })
  }

  async perform (result) {
    const parlVals = this.parliament.split('-')
    const parl = { number: parlVals[0], session: parlVals[1] }

    for (const vote of result) {
      vote.voters = await this.getVoters(vote.id, parl)
    }

    return result
  }
}

class VoteFetchJob extends Job {
  constructor (params, cb) {
    super(params.url, cb)
    this.params = params
  }

  static create (params, cb) {
    const job = new VoteFetchJob(params, cb)
    job
      .addAction(new FetchAction(params))
      .addAction(new ParserAction(VoteParser))
      .addAction(new DupeVotesFilterAction())
      .addAction(new VotersAction(params.parliament))
      .addAction(new FormatAction(params))
      .addErrorAction(new ErrorHandler(cb, VoteParser.create, []))
    job.params = params
    return job
  }
}

module.exports.VoteFetchJob = VoteFetchJob
module.exports.DupeVotesFilterAction = DupeVotesFilterAction
