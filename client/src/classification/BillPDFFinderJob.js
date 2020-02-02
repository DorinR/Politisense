const AbstractJob = require('../scraper/Job').AbstractJob
const LinkScraperAction = require('../scraper/job_actions/LinkScraperAction').LinkScraper
const Action = require('../scraper/job_actions/actions').Action
const TextParserAction = require('../scraper/job_actions/actions').TextParserAction
const SelectionAction = require('../scraper/job_actions/actions').SelectionAction
const ErrorHandler = require('../scraper/job_actions/actions').HandleDownloadErrorAction

class SelectFirstAction extends Action {
  constructor (bill) {
    super()
    this.bill = bill
  }

  async perform (links) {
    console.log(`INFO: Retrieved Bill link: ${links.selected[0]}`)
    return {
      link: links.selected[0],
      id: this.bill
    }
  }
}

class BillPDFFinderJob extends AbstractJob {
  constructor (url, bill, callback) {
    super(url, callback)
    this.bill = bill
  }

  static create (url, bill, callback) {
    return new BillPDFFinderJob(url, bill, callback)
      .addAction(new LinkScraperAction(url))
      .addAction(new TextParserAction(false, 'a', (elem, $) => {
        return $(elem).attr('href')
      }))
      .addAction(new SelectionAction('/Content/Bills/'))
      .addAction(new SelectionAction('PDF'))
      .addAction(new SelectFirstAction(bill))
      .addErrorAction(new ErrorHandler(callback, BillPDFFinderJob.create))
  }
}

module.exports.BillPDFFinderJob = BillPDFFinderJob
