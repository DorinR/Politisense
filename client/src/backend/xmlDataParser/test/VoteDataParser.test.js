/* eslint-env mocha */
import { assert } from 'chai'

import { VoteXmlParser } from '../VoteXmlParser'
import { VoteParticipantsXmlParser } from '../VoteParticipantsXmlParser'

const fs = require('fs')
const path = require('path')

describe('VoteXmlParser', () => {
  it('should return a final vote for bill C-19', () => {
    const parser = getVoteParserForXmlFile('testXml/testVote.xml')
    const votes = parser.getAllFromXml()
    assert.lengthOf(votes, 1, 'only 1 final vote for a bill')

    const vote = votes[0]
    assert.strictEqual(vote.number, 95)
    assert.strictEqual(vote.billNumber, 'C-19')
    assert.strictEqual(vote.subject, '3rd reading and adoption of Bill C-19, An Act for granting to Her Majesty certain sums of money for the federal public administration for the fiscal year ending March 31, 2017')
    assert.strictEqual(vote.yeas, 177)
    assert.strictEqual(vote.nays, 139)
    assert.isTrue(vote.accepted)
  })
})

describe('VoteParticipantsXmlParser', () => {
  it('should return dictionary of voters for bill C-47', () => {
    const parser = getVoteParticipantsParserForXmlFile('testXml/testVoteParticipants.xml')
    const voters = parser.getAllFromXml()
    assert.typeOf(voters, 'object', 'we get an dictionary object mapping Mps with there votes, not a list')

    assert.lengthOf(Object.keys(voters), 294, 'there were 294 voters, paired or not')
    const yeaVoters = Object.keys(voters).filter(key => voters[key].vote === 'Yea')
    assert.lengthOf(Object.keys(yeaVoters), 167, '167 members voted Yea')
    const nayVoters = Object.keys(voters).filter(key => voters[key].vote === 'Nay')
    assert.lengthOf(Object.keys(nayVoters), 126, '126 members voted Nay')
    const pairedVoters = Object.keys(voters).filter(key => voters[key].paired === true)
    assert.lengthOf(Object.keys(pairedVoters), 2, '2 members did a paired vote')

    // check case of normal vote
    assert.hasAnyKeys(voters, 'Michael Chong', 'Michael Chong is a voter')
    assert.strictEqual(voters['Michael Chong'].vote, 'Nay')
    assert.isFalse(voters['Michael Chong'].paired)

    // check case of paired vote with no Yea/nay
    assert.hasAnyKeys(voters, 'Jean-Yves Duclos', 'Jean-Yves Duclos is a voter')
    assert.strictEqual(voters['Jean-Yves Duclos'].vote, '')
    assert.isTrue(voters['Jean-Yves Duclos'].paired)

    // check case of paired vote with a Yea/Nay
    assert.hasAnyKeys(voters, 'Marilène Gill', 'Marilène Gill is a voter')
    assert.strictEqual(voters['Marilène Gill'].vote, 'Nay')
    assert.isTrue(voters['Marilène Gill'].paired)
  })

  it('should return an empty JSON if there is no participant data', () => {
    const voteParticipantsXmlWithNoParticipantData = '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<List xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" />'
    const parser = new VoteParticipantsXmlParser(voteParticipantsXmlWithNoParticipantData)
    assert.isEmpty(parser.getAllFromXml())
  })
})

function getVoteParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new VoteXmlParser(xml)
}

function getVoteParticipantsParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new VoteParticipantsXmlParser(xml)
}
