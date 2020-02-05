/* eslint-env jest */
const assert = require('chai').assert
const Utils = require('../../../util/utils')
const Parsers = Utils.Parsers
const BillXmlParser = Parsers.BillXmlParser
const ParliamentNotSetError = Parsers.ParliamentNotSetError

describe('BillXmlParser', () => {
  it('should return null if the bill does not have Royal Assent', () => {
    const nonRoyalAssentBill = { currentStage: 'BillDefeated' }
    const xml = genBillXml([nonRoyalAssentBill])

    let parser = new BillXmlParser(xml, { mustHaveRoyalAssent: true })
    assert.isNull(parser.xmlToJson())

    parser = new BillXmlParser(xml)
    assert.isNotNull(parser.xmlToJson())
  })

  it('should return specified bill info from xml', () => {
    const billXmlParams = {
      id: 9002286,
      numPrefix: 'C',
      numNumber: 51,
      introducedDate: '2017-06-06T10:08:07',
      title: 'An Act to amend the Criminal Code and the Department of Justice Act',
      sponsorFirstName: 'Jody',
      sponsorLastName: 'Wilson-Raybould',
      relativePath: '//parl.ca/DocumentViewer/en/10276765?Language=E'
    }
    const xml = genBillXml([billXmlParams])
    const parser = new BillXmlParser(xml)
    const bill = parser.xmlToJson()

    assert.isNotNull(bill)
    assert.strictEqual(bill.id, 9002286)
    assert.strictEqual(bill.number, 'C-51')
    assert.strictEqual(bill.title, 'An Act to amend the Criminal Code and the Department of Justice Act')
    assert.strictEqual(bill.sponsorName, 'jody wilson-raybould')
    assert.strictEqual(bill.link, 'https://www.parl.ca/DocumentViewer/en/10276765?Language=E')
    assert.strictEqual(bill.dateVoted, '2017-06-06')
    assert.hasAnyKeys(bill, ['text'])
  })

  it('should get all Royal Assent bills, ', () => {
    const xml = genBillXml([{}, {}, {}, {}, {}])
    const parser = new BillXmlParser(xml, { mustHaveRoyalAssent: true })
    const bills = parser.getAllFromXml()

    assert.strictEqual(bills.length, 5)
  })

  it('should return empty list if non bill xml', () => {
    const parser = new BillXmlParser('')
    const bills = parser.getAllFromXml()

    assert.isEmpty(bills)
  })

  it('should return null if bill is not of parliament', () => {
    const xml = genBillXml([{}])

    const parliamentThatDoesntMatchBill = {
      number: 41,
      session: 2
    }

    let parser = new BillXmlParser(xml, { mustBeInCurrentParliament: true }, parliamentThatDoesntMatchBill)
    const bill = parser.xmlToJson()
    assert.isNull(bill)

    parser = new BillXmlParser(xml, { mustBeInCurrentParliament: true })
    assert.throws(() => { parser.xmlToJson() }, ParliamentNotSetError)
  })
})

function genBillXml (billList) {
  let xml = '<Bills>'
  billList.forEach((bill, i) => {
    const billXml = `<Bill id="${bill.id || i}">
        <BillIntroducedDate>${bill.introducedDate || '2017-06-06T10:08:07'}</BillIntroducedDate>
        <ParliamentSession parliamentNumber="${bill.parliamentNumber || 42}" sessionNumber="${bill.sessionNumber || 1}"/>
        <BillNumber prefix="${bill.numPrefix || 'C'}" number="${bill.numNumber || 51}"/>
        <BillTitle>
            <Title language="en">${bill.title || 'Title'}</Title>
            <Title language="fr">${bill.fTitle || 'French Title'}</Title>
        </BillTitle>
        <SponsorAffiliation>
            <Person>
                <FirstName>${bill.sponsorFirstName || 'SponsorFirstName'}</FirstName>
                <LastName>${bill.sponsorLastName || 'SponsorLastName'}</LastName>
            </Person>
        </SponsorAffiliation>
        <Publications>
            <Publication id="9013230">
                <Title language="en">First Reading</Title>
                <Title language="fr">Première lecture</Title>
                <PublicationFiles>
                    <PublicationFile language="en" relativePath="path"/>
                    <PublicationFile language="fr" relativePath="path"/>
                </PublicationFiles>
            </Publication>
            <Publication id="10276765">
                <Title language="en">Royal Assent</Title>
                <Title language="fr">Sanction royale</Title>
                <PublicationFiles>
                    <PublicationFile language="en" relativePath="${bill.relativePath || '//parl.ca/1?Language=E'}"/>
                    <PublicationFile language="fr" relativePath="${bill.fRelativePath || '//parl.ca/1?Language=F'}"/>
                </PublicationFiles>
            </Publication>
        </Publications>
        <Events laagCurrentStage="${bill.currentStage || 'RoyalAssentGiven'}">Empty</Events>
    </Bill>`
    xml += billXml
  })
  xml += '</Bills>'
  return xml
}
