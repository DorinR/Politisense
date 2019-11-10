const Classifier = require('./Classifier').Classifier
const FireStore = require('../Firebase').FireStore
const Reader = require('../scraper/job_actions/UrlFileReaderAction').FileReader
const Scraper = require('../scraper/job_actions/LinkScraperAction').LinkScraper
const ScrapeError = require('../scraper/job_actions/LinkScraperAction').ScrapeError
const Parser = require('../scraper/job_actions/TextParserAction').TextParser
const Selector = require('../scraper/job_actions/SelectionAction').Selector

class ClassificationManager {
  constructor () {
    this.classifier = new Classifier()
    this.documentCount = 0
    this.onDone = () => {}
  }

  getCurrentClassifications () {
    return this.classifier.getAllTermsByDocuments()
  }

  load () {
    return new Promise(resolve => {
      new FireStore().BillClassification()
        .select()
        .then(query => {
          let i = 0
          query.forEach((doc) => {
            if (i++ === query.size - 1) {
              console.debug(doc.data())
              this.classifier.load(doc.state)
            }
          })
        })
        .catch(e => {
          console.error(e.message)
        })
    })
  }

  save () {
    const state = this.classifier.save()
    console.debug(state)
    new FireStore().BillClassification()
      .insert({ state: state })
      .catch(e => {
        console.error(e.message)
      })
  }

  parseForLinks (html) {
    const parser = new Parser()
    const $ = parser.load(html)
    return parser.perform(html, 'a', (elem) => {
      return $(elem).attr('href')
    })
  }

  selectXmlFileFromLinks (links) {
    const groupSelector = new Selector('/Content/Bills/')
    groupSelector.perform(links)
    const xmlSelector = new Selector('xml')
    xmlSelector.perform(groupSelector.selected)
    return xmlSelector.selected[0]
  }

  retrieveXmlFile (fp) {
    const filepath = 'https://www.parl.ca' + fp.slice(0, fp.length)
    return new Reader(filepath).perform()
  }

  getInitialDomNodes (xml) {
    const parser = new Parser()
    const $ = parser.loadAsXml(xml)
    const startingNodes = $('Bill')[0] ? $('Bill')[0].children : null
    if (!startingNodes) {
      throw new ScrapeError('cannot scrape bill')
    }
    const nodes = []
    startingNodes.forEach(node => {
      nodes.push(node)
    })
    return startingNodes
  }

  getAllContent (nodes) {
    let contentString = ''
    while (nodes.length > 0) {
      const node = nodes[0]
      if (node && node.children && node.children.length > 0) {
        node.children.forEach(node => {
          nodes.push(node)
        })
      } else if (node.type === 'text') {
        contentString += node.data + ' '
      }
      nodes.shift()
    }
    return contentString
  }

  async fetch (document) {
    return new Promise((resolve, reject) => {
      const contents = document.data()
      new Scraper(contents.link).perform()
        .then(html => {
          return this.parseForLinks(html)
        })
        .then(links => {
          return this.selectXmlFileFromLinks(links)
        })
        .then(filepath => {
          return this.retrieveXmlFile(filepath)
        })
        .then(xml => {
          return this.getInitialDomNodes(xml)
        })
        .then(nodes => {
          return this.getAllContent(nodes)
        })
        .then(content => {
          return {
            name: contents.name,
            content: content
          }
        })
        .then(result => {
          this.classifier.addDocument(result.name, result.content)
          if (--this.documentCount === 0) {
            this.onDone()
          }
          resolve(result)
        })
        .catch(e => {
          if (--this.documentCount === 0) {
            this.onDone()
          }
          reject(e)
        })
    })
  }

  fetchDocuments (documents) {
    documents.forEach(doc => {
      this.fetchDocument(doc)
        .catch(e => {
          console.error(e.message)
        })
    })
  }

  async fetchDocument (document) {
    return new Promise((resolve, reject) => {
      this.fetch(document)
        .then(result => {
          resolve(result)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  async fetchDocumentData () {
    return new Promise((resolve, reject) => {
      new FireStore().Bill()
        .select()
        .then(documents => {
          this.documentCount = documents.size
          this.fetchDocuments(documents)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

class ClassificationRunner {
  constructor () {
    this.manager = new ClassificationManager()
  }

  createBillClassificationsFromFirestore (onDone) {
    this.manager.onDone = onDone
    return this.manager.fetchDocumentData()
  }

  initialiseFromFirestore () {
    return this.manager.load()
  }

  save () {
    this.manager.save()
  }

  getClassifications () {
    return this.manager.getCurrentClassifications()
  }
}

module.exports.ClassificationRunner = ClassificationRunner
