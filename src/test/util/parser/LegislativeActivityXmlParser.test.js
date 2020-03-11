/* eslint-env jest */
const Assert = require('chai').assert
const Parsers = require('../../../util/parser/parsers')

describe('LegislativeActivityXmlParser.js', () => {
  let underTest
  let xml
  beforeAll(() => {
    xml = '<rss version="2.0">\n' +
        '<channel>\n' +
        '<title>Custom RSS Feed</title>\n' +
        '<language>en</language>\n' +
        '<description>Custom RSS Feed/Fil RSS personnalisé</description>\n' +
        '<link>https://www.parl.ca/LegisInfo/</link>\n' +
        '<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&Language=E&Mode=1&Source=LegislativeFilteredBills&AllBills=1&HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149&RelInfo=MajSpeach,LOPLegSum,JRNLArt,DepartmentPressRel,SpeakRule,NewsArt,PartyPressRel,ComingIntoForce" rel="self" type="application/rss+xml"/>\n' +
        '<item>\n' +
        '<title>C-4, Debate at 3rd Reading in the House of Commons</title>\n' +
        '<link>\n' +
        'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10615191\n' +
        '</link>\n' +
        '<description>\n' +
        'C-4, An Act to implement the Agreement between Canada, the United States of America and the United Mexican States\n' +
        '</description>\n' +
        '<pubDate>Tue, 10 Mar 2020 00:00:00 EST</pubDate>\n' +
        '</item>\n' +
        '<item>\n' +
        '<title>C-4, Debate at 3rd Reading in the House of Commons</title>\n' +
        '<link>\n' +
        'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10615191\n' +
        '</link>\n' +
        '<description>\n' +
        'C-4, An Act to implement the Agreement between Canada, the United States of America and the United Mexican States\n' +
        '</description>\n' +
        '<pubDate>Tue, 10 Mar 2020 00:00:00 EST</pubDate>\n' +
        '</item>' +
        '</channel>' +
        '</rss>'
  })

  beforeEach(() => {
    underTest = new Parsers.LegislativeActivityXmlParser(xml)
  })

  test('LegislativeActivityXmlParser.js::generateNewParser creates a new Legislative activity Parser', () => {
    const parser = underTest.generateNewParser(underTest.xml)
    Assert.equal(parser.xml, underTest.getXmlInTag(Parsers.LegislativeActivityXmlParser.listTagName()))
  })

  test('LegislativeActivityXmlParser.js::hasData returns true on has content, false otherwise', () => {
    Assert(underTest.hasData())
    Assert(underTest.parser.hasData())
    Assert.isFalse(underTest.generateNewParser('<rss><channel>channel stuff</channel></rss>').hasData())
  })

  test('LegislativeActivityXmlParser.js::buildJson returns valid legislative activity', () => {
    const activities = underTest.getAllFromXml()
    Assert.equal(activities.length, 2)
    Assert.equal(activities[0].yes, 0)
    Assert.equal(activities[0].no, 0)
    Assert.equal(activities[0].title, 'C-4, Debate at 3rd Reading in the House of Commons')

    Assert.equal(activities[1].yes, 0)
    Assert.equal(activities[1].no, 0)
    Assert.equal(activities[1].title, 'C-4, Debate at 3rd Reading in the House of Commons')
  })
})
