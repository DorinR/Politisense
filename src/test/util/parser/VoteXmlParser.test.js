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
    const yeaVoter = { firstName: 'Voter', lastName: 'One', vote: 'Yea' }
    const nayVoter = { firstName: 'Michael', lastName: 'Chong', vote: 'Nay' }
    const pairedVoter = { firstName: 'Jean-Yves', lastName: 'Duclos', vote: 'Paired', paired: true }
    const pairedVoterWithVote = { firstName: 'Marilène', lastName: 'Gill', vote: 'Nay', paired: true }

    const xml = genVotersXml([yeaVoter, nayVoter, pairedVoter, pairedVoterWithVote])
    const parser = new VoteParticipantsXmlParser(xml)
    const voters = parser.getAllFromXml()
    assert.typeOf(voters, 'object', 'we get an dictionary object mapping Mps with there votes, not a list')

    assert.lengthOf(Object.keys(voters), 4)
    const yeaVoters = Object.keys(voters).filter(key => voters[key].vote === 'Yea')
    assert.lengthOf(Object.keys(yeaVoters), 1)
    const nayVoters = Object.keys(voters).filter(key => voters[key].vote === 'Nay')
    assert.lengthOf(Object.keys(nayVoters), 2)
    const pairedVoters = Object.keys(voters).filter(key => voters[key].paired === true)
    assert.lengthOf(Object.keys(pairedVoters), 2)

    // check case of normal vote
    assert.hasAnyKeys(voters, ['michael chong'], 'Michael Chong is a voter')
    assert.strictEqual(voters['michael chong'].vote, 'Nay')
    assert.isFalse(voters['michael chong'].paired)

    // check case of paired vote with no Yea/nay
    assert.hasAnyKeys(voters, ['jean-yves duclos'], 'Jean-Yves Duclos is a voter')
    assert.strictEqual(voters['jean-yves duclos'].vote, 'Paired')
    assert.isTrue(voters['jean-yves duclos'].paired)

    // check case of paired vote with a Yea/Nay
    assert.hasAnyKeys(voters, ['marilène gill'], 'Marilène Gill is a voter')
    assert.strictEqual(voters['marilène gill'].vote, 'Nay')
    assert.isTrue(voters['marilène gill'].paired)
  })

  it('should return empty JSON if no participant data', () => {
    const voteParticipantsXmlWithNoParticipantData = '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<List xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" />'
    const parser = new VoteParticipantsXmlParser(voteParticipantsXmlWithNoParticipantData)
    assert.isEmpty(parser.getAllFromXml())
  })

  it('should get the vote id from the list of participants', () => {
    const votersXmlWithId = { voteNumber: 752 }
    const xml = genVotersXml([votersXmlWithId])
    const parser = new VoteParticipantsXmlParser(xml)
    const voteId = parser.getVoteId()

    assert.strictEqual(voteId, 752)
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
  let xml = '<List>'
  votersList.forEach((voter, i) => {
    const voterXml = `<VoteParticipant>
        <ParliamentNumber>${voter.parliamentNumber || 42}</ParliamentNumber>
        <SessionNumber>${voter.sessionNumber || 1}</SessionNumber>
        <DecisionDivisionNumber>${voter.voteNumber || 752}</DecisionDivisionNumber>
        <VoteValueName>${voter.vote || 'Nay'}</VoteValueName>
        <FirstName>${voter.firstName || 'FirstName' + i}</FirstName>
        <LastName>${voter.lastName || 'LastName' + i}</LastName>
        <Paired>${voter.paired ? 1 : 0}</Paired>
    </VoteParticipant>`
    xml += voterXml
  })
  xml += '</List>'
  return xml
}
