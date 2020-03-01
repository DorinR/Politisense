const Actions = require('@action')
const AbstractJob = require('../util/Job').AbstractJob
const FetchAction = Actions.FetchAction
const Action = Actions.Action
const TextParserAction = Actions.TextParserAction
const SelectionAction = Actions.SelectionAction
const ErrorHandler = Actions.HandleDownloadErrorAction

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
  constructor (params, callback) {
    super(params.url, callback)
    this.params = params
  }

  static create (params, callback) {
    return new BillPDFFinderJob(params, callback)
      .addAction(new FetchAction(BillPDFFinderJob.createRequestParams(params)))
      .addAction(new TextParserAction(false, 'a', (elem, $) => {
        return $(elem).attr('href')
      }))
      .addAction(new SelectionAction('/Content/Bills/'))
      .addAction(new SelectionAction('PDF'))
      .addAction(new SelectFirstAction(params.bill))
      .addErrorAction(new ErrorHandler(callback, BillPDFFinderJob.create, params))
  }

  static createRequestParams (params) {
    return {
      url: params.url,
      params: params.params
    }
  }
}

module.exports.BillPDFFinderJob = BillPDFFinderJob
