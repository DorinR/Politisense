require('module-alias/register')
const Parser = require('@parser').XmlDataParser
const LegislativeActivity = require('@model').LegislativeActivity

class _LegislativeActivityXmlParser extends Parser {
  // eslint-disable-next-line no-useless-constructor
  constructor (xml) {
    super(xml)
  }

  static tagName () {
    return 'item'
  }

  static listTagName () {
    return 'channel'
  }

  get tagName () {
    return _LegislativeActivityXmlParser.tagName()
  }

  get listTagName () {
    return _LegislativeActivityXmlParser.listTagName()
  }

  generateNewParser (xml) {
    return new _LegislativeActivityXmlParser(xml)
  }

  buildJson () {
    const json = {
      number: '',
      title: this.getDataInTag('title').trim(),
      link: this.getDataInTag('link').trim(),
      description: this.getDataInTag('description').trim(),
      date: this.getDataInTag('pubDate').trim(),
      yes: 0,
      no: 0
    }
    return LegislativeActivity.deserialise(json)
  }

  hasData () {
    return super.hasData() || this.isTagInXml(this.tagName)
  }
}

class LegislativeActivityXmlParser extends Parser {
  constructor (xml) {
    super(xml)
    this.parser = new _LegislativeActivityXmlParser(
      this.getXmlInTag(this.tagName)
    )
  }

  static tagName () {
    return 'channel'
  }

  static listTagName () {
    return 'rss'
  }

  get tagName () {
    return LegislativeActivityXmlParser.tagName()
  }

  get listTagName () {
    return LegislativeActivityXmlParser.listTagName()
  }

  generateNewParser (xml) {
    xml = this.getXmlInTag(this.tagName)
    return new _LegislativeActivityXmlParser(xml)
  }

  hasData () {
    return super.hasData() || this.isTagInXml(this.tagName)
  }

  getAllFromXml () {
    return this.parser.getAllFromXml()
  }

  buildJson () {
    return this.parser.buildJson()
  }
}

module.exports = {
  LegislativeActivityXmlParser: LegislativeActivityXmlParser
}
