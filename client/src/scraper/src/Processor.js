
class Processor {
  constructor () {
    this.urls = []
    this.xmlLinks = []
  }

  process (links) {
    links.forEach((link) => {
      if (typeof link === 'undefined') {
        return
      }
      const l = link.toLowerCase()
      if (l.includes('xml')) {
        this.xmlLinks.push('xml')
      } else {
        this.urls.push(link)
      }
    })
    return this.urls
  }
}

module.exports.Processor = Processor
