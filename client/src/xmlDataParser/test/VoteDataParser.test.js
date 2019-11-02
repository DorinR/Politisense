/* eslint-env mocha */
import { assert } from 'chai'

import { VoteXmlParser } from '../VoteXmlParser'
// import { VoteParticipantsXmlParser } from '../VoteParticipantsXmlParser'

const fs = require('fs')
const path = require('path')

describe('VoteXmlParser', () => {
  it('should return a final vote for bill C-19', () => {
    const parser = getVoteParserForXmlFile('testXml/testVote.xml')
    const votes = parser.getAllFromXml()
    console.log(votes)
    assert.lengthOf(votes, 1, 'only 1 final vote for a bill')

    const vote = votes[0]
    assert.strictEqual(vote.number, 95)
    assert.strictEqual(vote.billNumber, 'C-19')
    assert.strictEqual(vote.subject, '3rd reading and adoption of Bill C-19, An Act for granting to Her Majesty certain sums of money for the federal public administration for the fiscal year ending March 31, 2017')
    assert.strictEqual(vote.yeas, 177)
    assert.strictEqual(vote.nays, 139)
    assert.isTrue(vote.accepted)
  })

  // TODO: test vote participants
})

function getVoteParserForXmlFile (xmlFilePath) {
  const pathToXml = path.resolve(__dirname, xmlFilePath)
  const xml = fs.readFileSync(pathToXml)
  return new VoteXmlParser(xml)
}
