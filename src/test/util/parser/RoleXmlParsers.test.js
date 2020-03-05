/* eslint-env jest */
const Assert = require('chai').assert
const Parsers = require('../../../util/parser/parsers')

describe('Roles', () => {

  describe('RoleXmlParser.js', () => {
    let underTest
    let xml
    beforeEach(() => {
      xml = '<Profile xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
        '<MemberOfParliamentRoles>' +
        '<MemberOfParliamentRole>\n' +
        '<PersonShortHonorific>Hon.</PersonShortHonorific>\n' +
        '<PersonOfficialFirstName>Omar</PersonOfficialFirstName>\n' +
        '<PersonOfficialLastName>Alghabra</PersonOfficialLastName>\n' +
        '<ConstituencyName>Mississauga Centre</ConstituencyName>\n' +
        '<ConstituencyProvinceTerritoryName>Ontario</ConstituencyProvinceTerritoryName>\n' +
        '<CaucusShortName>Liberal</CaucusShortName>\n' +
        '<FromDateTime>2019-10-21T00:00:00</FromDateTime>\n' +
        '<ToDateTime xsi:nil="true"/>\n' +
        '</MemberOfParliamentRole>'+
        '</MemberOfParliamentRoles>' +
        '<CaucusMemberRoles>' +
        '<CaucusMemberRole>\n' +
        '<CaucusShortName>Liberal</CaucusShortName>\n' +
        '<FromDateTime>2015-10-19T00:00:00</FromDateTime>\n' +
        '<ToDateTime>2019-10-20T23:59:59</ToDateTime>\n' +
        '<ParliamentNumber>42</ParliamentNumber>\n' +
        '</CaucusMemberRole>'+
        '</CaucusMemberRoles>'+
        '<ParliamentaryPositionRoles>' +
        '<ParliamentaryPositionRole>\n' +
        '<Title>\n' +
        'Parliamentary Secretary to the Prime Minister (Public Service Renewal) and to the Deputy Prime Minister and Minister of Intergovernmental Affairs\n' +
        '</Title>\n' +
        '<FromDateTime>2019-12-12T00:00:00</FromDateTime>\n' +
        '<ToDateTime xsi:nil="true"/>\n' +
        '</ParliamentaryPositionRole>' +
        '</ParliamentaryPositionRoles>' +
        '<CommitteeMemberRoles>' +
        '<CommitteeMemberRole>\n' +
        '<ParliamentNumber>43</ParliamentNumber>\n' +
        '<SessionNumber>1</SessionNumber>\n' +
        '<AffiliationRoleName>Member</AffiliationRoleName>\n' +
        '<CommitteeName>Procedure and House Affairs</CommitteeName>\n' +
        '<FromDateTime>2020-02-03T15:08:00</FromDateTime>\n' +
        '<ToDateTime xsi:nil="true"/>\n' +
        '</CommitteeMemberRole>'+
        '</CommitteeMemberRoles>'+
        '<ParliamentaryAssociationsandInterparliamentaryGroupRoles>' +
        '<ParliamentaryAssociationsandInterparliamentaryGroupRole>\n' +
        '<AssociationMemberRoleType>Association Member</AssociationMemberRoleType>\n' +
        '<Title/>\n' +
        '<Organization>Canada-China Legislative Association</Organization>\n' +
        '</ParliamentaryAssociationsandInterparliamentaryGroupRole>' +
        '</ParliamentaryAssociationsandInterparliamentaryGroupRoles>'+
        '<ElectionCandidateRoles>' +
        '<ElectionCandidateRole>\n' +
        '<ElectionEventTypeName>General Election</ElectionEventTypeName>\n' +
        '<ElectionEndDate>2019-10-21T00:00:00</ElectionEndDate>\n' +
        '<ConstituencyName>Mississauga Centre</ConstituencyName>\n' +
        '<ConstituencyProvinceTerritoryName>Ontario</ConstituencyProvinceTerritoryName>\n' +
        '<PoliticalPartyName>Liberal Party of Canada</PoliticalPartyName>\n' +
        '<ResolvedElectionResultTypeName>Re-Elected</ResolvedElectionResultTypeName>\n' +
        '</ElectionCandidateRole>'+
        '</ElectionCandidateRoles>' +
        '</Profile>'
      underTest = new Parsers.RoleXmlParser(xml)
    })

    test('RoleXmlParser.js::generateNewParser creates a new Role Parser', () => {
      const parser = underTest.generateNewParser(underTest.xml)
      Assert.equal(parser.xml, underTest.xml)
    })

    test('RoleXmlParser.js::hasData returns true on has content, false otherwise', () => {
      Assert(underTest.hasData())
      Assert.isFalse(underTest.generateNewParser('').hasData())
    })

    test('RoleXmlParser.js::buildJson returns an object with 3 different role types', () => {
      const [roles] = underTest.getAllFromXml()

      const keys = Object.keys(roles)
      Assert.equal(keys.length, 3)

      Assert.equal(keys[0], 'associations')
      Assert.equal(keys[1], 'committees')
      Assert.equal(keys[2], 'parliamentaries')

      Assert.equal(roles.associations.length, 1)
      Assert.equal(roles.committees.length, 1)
      Assert.equal(roles.parliamentaries.length, 1)
    })
  })

  describe('AssociationRoleXmlParser.js', () => {
    let underTest
    let xml
    beforeEach(() => {
      underTest = new Parsers.AssociationRoleXmlParser()
    })
  })

  describe('CommitteeRoleXmlParser.js', () => {
    let underTest
    let xml
    beforeEach(() => {
      underTest = new Parsers.CommitteeRoleXmlParser()
    })
  })

  describe('ParliamentaryRoleXmlParser.js', () => {
    let underTest
    let xml
    beforeEach(() => {
      underTest = new Parsers.ParliamentaryRoleXMLParser()
    })
  })
})