const utils = require('../util/utils')
const Job = utils.Job
const Actions = utils.Actions
const Scraper = Actions.LinkScraperAction
const Parser = Actions.TextParserAction
const Processor = Actions.SelectionAction
const ErrorHandler = Actions.HandleConnectionErrorAction
const RequeueAction = Actions.RequeueAction

class ScrapeJob extends Job {
  // eslint-disable-next-line no-useless-constructor
  constructor (url, cb) {
    super(url, cb)
  }

  static create (url, cb, tlds) {
    return new ScrapeJob(url, cb, tlds)
      .addAction(new Scraper(url))
      .addAction(new Parser(false, 'a', (elem, $) => {
        return $(elem).attr('href')
      }))
      .addAction(new Processor('xml'))
      .addAction(new RequeueAction(cb, ScrapeJob.create, tlds))
      .addErrorAction(new ErrorHandler(cb, ScrapeJob.create, tlds))
  }
}
module.exports.ScrapeJob = ScrapeJob
