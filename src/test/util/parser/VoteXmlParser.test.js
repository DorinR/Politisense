/* eslint-env jest */
const assert = require('chai').assert
const Parsers = require('../../../util/parser/parsers')
const VoteXmlParser = Parsers.VoteXmlParser
const VoteParticipantsXmlParser = Parsers.VoteParticipantsXmlParser

describe('VoteXmlParser', () => {
  it('should return a final vote for bill C-19', () => {
    const nonFinalVote = { billNumber: 'C-19', name: '2nd Reading' }
    const nonBillVote = { name: '3rd reading and adoption of Bill C-17' }
    const finalBillVote = {
      id: 95,
      billNumber: 'C-19',
      name: '3rd reading and adoption of Bill C-19',
      yeas: 177,
      nays: 139
    }

    const xml = genVoteXml([{}, nonFinalVote, nonBillVote, finalBillVote])
    const parser = new VoteXmlParser(xml)
    const votes = parser.getAllFromXml()

    const vote = votes[3]
    assert.strictEqual(vote.id, 95)
    assert.strictEqual(vote.billNumber, 'C-19')
    assert.strictEqual(vote.name, '3rd reading and adoption of Bill C-19')
    assert.strictEqual(vote.yeas, 177)
    assert.strictEqual(vote.nays, 139)
  })

  it('should return false if current parliament not satisfied', () => {
    const parser = new VoteXmlParser('', { number: 42, session: 1 })
    assert.isFalse(parser.isInCurrentParliament())
  })
})

describe('VoteParticipantsXmlParser', () => {
  it('should return dictionary of voters for bill C-47', () => {
    const yeaVoter = { firstName: 'Voter', lastName: 'One', yea: true }
    const nayVoter = { firstName: 'Michael', lastName: 'Chong', yea: false }
    const pairedVoter = { firstName: 'Jean-Yves', lastName: 'Duclos', yea: true, paired: true }
    const pairedVoterWithVote = { firstName: 'Marilène', lastName: 'Gill', yea: false, paired: true }

    const xml = genVotersXml([yeaVoter, nayVoter, pairedVoter, pairedVoterWithVote])
    const parser = new VoteParticipantsXmlParser(xml, 'someStringID')
    const voters = parser.getAllFromXml()
    assert(voters instanceof Array, 'should return an array')

    assert.lengthOf(voters, 4)
    const yeaVoters = voters.filter(voter => voter.yea === true)
    assert.lengthOf(yeaVoters, 2)
    const nayVoters = voters.filter(voter => voter.yea !== true)
    assert.lengthOf(nayVoters, 2)
    const pairedVoters = voters.filter(voter => voter.paired === true)
    assert.lengthOf(pairedVoters, 2)

    // check case of normal vote
    assert.equal(voters[1].member, 'michael chong', 'Michael Chong is a voter')
    assert.strictEqual(voters[1].yea, false)
    assert.isFalse(voters[1].paired)

    // check case of paired vote with no Yea/nay
    assert.equal(voters[2].member, 'jean-yves duclos', 'Jean-Yves Duclos is a voter')
    assert.strictEqual(voters[2].yea, true)
    assert.isTrue(voters[2].paired)
  })

  it('should return empty JSON if no participant data', () => {
    const voteParticipantsXmlWithNoParticipantData = '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<ArrayOfVoteParticipants xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" />'
    const parser = new VoteParticipantsXmlParser(voteParticipantsXmlWithNoParticipantData, 'someStringID')
    assert.isEmpty(parser.getAllFromXml())
  })
})

function genVoteXml (voteList) {
  let xml = '<ArrayOfVote>'
  voteList.forEach((vote, i) => {
    const billNumberCode = (typeof vote.billNumber !== 'undefined')
      ? `<BillNumberCode>${vote.billNumber}</BillNumberCode>` : '<BillNumberCode />'

    const voteXml = `<Vote>
        <ParliamentNumber>${vote.parliamentNumber || 42}</ParliamentNumber>
        <DecisionEventDateTime>2014-02-18</DecisionEventDateTime>
        <SessionNumber>${vote.sessionNumber || 1}</SessionNumber>
        <DecisionDivisionNumber>${vote.id || i}</DecisionDivisionNumber>
        <DecisionDivisionSubject>${vote.name || 'Vote Subject Name'}</DecisionDivisionSubject>
        <DecisionDivisionNumberOfYeas>${vote.yeas || 0}</DecisionDivisionNumberOfYeas>
        <DecisionDivisionNumberOfNays>${vote.nays || 0}</DecisionDivisionNumberOfNays>
        ${billNumberCode}
    </Vote>`
    xml += voteXml
  })
  xml += '</ArrayOfVote>'
  return xml
}

function genVotersXml (votersList) {
  let xml = '<ArrayOfVoteParticipant>'
  votersList.forEach((voter, i) => {
    const voterXml = `<VoteParticipant>
        <ParliamentNumber>${voter.parliamentNumber || 42}</ParliamentNumber>
        <SessionNumber>${voter.sessionNumber || 1}</SessionNumber>
        <DecisionDivisionNumber>${voter.voteNumber || 752}</DecisionDivisionNumber>
        <IsVoteYea>${voter.yea}</IsVoteYea>
        <PersonOfficialFirstName>${voter.firstName || 'PersonOfficialFirstName' + i}</PersonOfficialFirstName>
        <PersonOfficialLastName>${voter.lastName || 'PersonOfficialLastName' + i}</PersonOfficialLastName>
        <IsVotePaired>${voter.paired}</IsVotePaired>
    </VoteParticipant>`
    xml += voterXml
  })
  xml += '</ArrayOfVoteParticipant>'
  return xml
}
