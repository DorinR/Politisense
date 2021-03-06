/* eslint-env jest */
const assert = require('chai').assert
const Parsers = require('../../../util/parser/parsers')
const MpXmlParser = Parsers.MpXmlParser

describe('MpXmlParser', () => {
  it('should return mp info from xml', () => {
    const mpXmlParams = {
      firstName: 'Jody',
      lastName: 'Wilson-Raybould',
      riding: 'Vancouver Granville',
      party: 'Independent',
      fromDate: '2015-10-19T00:00:00',
      toDate: '2019-10-19T00:00:00'
    }
    const xml = genMpXml([mpXmlParams])
    const parser = new MpXmlParser(xml)
    assert.isTrue(parser.hasData())
    const mp = parser.xmlToJson()

    assert.strictEqual(mp.name, 'jody wilson-raybould')
    assert.strictEqual(mp.party, 'independent')
    assert.strictEqual(mp.riding, 'vancouver granville')
    assert.strictEqual(mp.start, 2015)
    assert.strictEqual(mp.end, 2019)
    assert.hasAnyKeys(mp, ['imageUrl'])
  })

  it('should get all mps in the list of mps in the xml', () => {
    const xml = genMpXml([{}, {}, {}, { toDate: '2000-11-26T00:00:00' }])
    let parser = new MpXmlParser(xml)
    assert.isTrue(parser.hasData())
    assert.isTrue(parser.hasListOfData())

    const mps = parser.getAllFromXml()
    assert.strictEqual(mps.length, 4)

    // case where filter only for current mps
    parser = new MpXmlParser(xml, true)
    const mpsOnlyCurrent = parser.getAllFromXml()
    assert.strictEqual(mpsOnlyCurrent.length, 3)
  })

  it('should return true if is a current mp', () => {
    const currentMp = { toDate: undefined }
    let xml = genMpXml([currentMp])
    let parser = new MpXmlParser(xml)
    assert.isTrue(parser.isACurrentMember())

    const nonCurrentMp = { toDate: '2000-11-26T00:00:00' }
    xml = genMpXml([nonCurrentMp])
    parser = new MpXmlParser(xml)
    assert.isFalse(parser.isACurrentMember())
  })
})

function genMpXml (mpList) {
  let xml = '<ArrayOfMemberOfParliament>'
  mpList.forEach((mp, i) => {
    const toDate = (typeof mp.toDate !== 'undefined')
      ? `<ToDateTime>${mp.toDate}</ToDateTime>` : '<ToDateTime xsi:nil="true"/>'

    const mpXml = `<MemberOfParliament>
        <PersonOfficialFirstName>${mp.firstName || 'FirstName' + i}</PersonOfficialFirstName>
        <PersonOfficialLastName>${mp.lastName || 'LastName' + i}</PersonOfficialLastName>
        <ConstituencyName>${mp.riding || 'RidingName'}</ConstituencyName>
        <CaucusShortName>${mp.party || 'PoliticalParty'}</CaucusShortName>
        <FromDateTime>${mp.fromDate || '2019-10-21T00:00:00'}</FromDateTime>
        ${toDate}
    </MemberOfParliament>`
    xml += mpXml
  })
  xml += '</ArrayOfMemberOfParliament>'
  return xml
}
