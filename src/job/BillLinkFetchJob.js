const Actions = require('@action')
const AbstractJob = require('../util/Job').AbstractJob
const FetchAction = Actions.FetchAction
const FormatAction = Actions.BillLinkFetchAdapterAction
const TextParserAction = Actions.TextParserAction
const SelectionAction = Actions.SelectionAction
const ErrorHandler = Actions.HandleConnectionErrorAction

class BillLinkFetchJob extends AbstractJob {
  // eslint-disable-next-line no-useless-constructor
  constructor (params, callback) {
    super(params, callback)
    this.params = params
  }

  static create (params, callback) {
    return new BillLinkFetchJob(params, callback)
      .addAction(new FetchAction(AbstractJob.createRequestParams(params)))
      .addAction(new TextParserAction(false, 'a', (elem, $) => {
        return $(elem).attr('href')
      }))
      .addAction(new SelectionAction('/Content/Bills/'))
      .addAction(new SelectionAction('PDF'))
      .addAction(new FormatAction(params))
      .addErrorAction(new ErrorHandler(callback, BillLinkFetchJob.create, params))
  }
}

module.exports.BillLinkFetchJob = BillLinkFetchJob
