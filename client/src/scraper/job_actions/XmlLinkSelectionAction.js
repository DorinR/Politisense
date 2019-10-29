const JobAction = require('./JobAction').AbstractJobAction

class XmlLinkSelectionAction extends JobAction {
  constructor () {
    super()
    this.urls = []
    this.xmlLinks = []
  }

  perform (links) {
    links.forEach((link) => {
      if (typeof link === 'undefined') {
        return
      }
      const l = link.toLowerCase()
      if (l.includes('xml')) {
        this.xmlLinks.push(link)
      } else {
        this.urls.push(link)
      }
    })
    return this.urls
  }
}

module.exports.XmlLinkSelector = XmlLinkSelectionAction
