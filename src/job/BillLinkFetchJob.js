const Actions = require('@action')
const AbstractJob = require('../util/Job').AbstractJob
const FetchAction = Actions.FetchAction
const Action = Actions.Action
const TextParserAction = Actions.TextParserAction
const SelectionAction = Actions.SelectionAction
const ErrorHandler = Actions.HandleConnectionErrorAction

class SelectFirstAction extends Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (links) {
    console.log(`INFO: Retrieved Bill link: ${links.selected[0]}`)
    return {
      url: links.selected[0],
      id: this.params.bill,
      parliament: this.params.parliament
    }
  }
}

class BillLinkFetchJob extends AbstractJob {
  constructor (params, callback) {
    super(params, callback)
    this.params = params
  }

  static create (params, callback) {
    return new BillLinkFetchJob(params, callback)
      .addAction(new FetchAction(BillLinkFetchJob.createRequestParams(params)))
      .addAction(new TextParserAction(false, 'a', (elem, $) => {
        return $(elem).attr('href')
      }))
      .addAction(new SelectionAction('/Content/Bills/'))
      .addAction(new SelectionAction('PDF'))
      .addAction(new SelectFirstAction(params))
      .addErrorAction(new ErrorHandler(callback, BillLinkFetchJob.create, params))
  }

  static createRequestParams (params) {
    return {
      url: params.url,
      params: params.params
    }
  }
}

module.exports.BillLinkFetchJob = BillLinkFetchJob
