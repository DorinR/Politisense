require('module-alias/register')
const Utils = require('@utils')
const QueueManager = Utils.QueueManager.QueueManager
const BeforeAction = Utils.QueueManager.Before.PDFRetrieval
const StartAction = Utils.QueueManager.Start.PDFRetrieval
const StopAction = Utils.QueueManager.Stop.GenericStopAction
//const AfterAction = Utils.QueueManager.After.PDFRetrieval
//const Throw = Utils.QueueManager.Error.ScrapeErrorAction



class PDFRetrievalRunner extends QueueManager {
  static create(params, wait = 5000){
    const manager = new PDFRetrievalRunner(params, wait)
    manager
      .setBeforeAction(new BeforeAction(manager))
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      //.setAfterAction(new AfterAction(manager))
      //.setErrorAction(new Throw(manager))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    if(!params.parliaments || params.parliaments === 'all') {
      this.parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
    } else if (params.parliaments instanceof Array) {
      this.parliaments = params.parliaments
    } else {
      throw new Error('ERROR: no parliaments specified')
    }
    this.params = this.parliaments.map(parl => {
      return {
        parliament: parl
      }
    })
  }

  accumulate (result) {
    if(result) {
      this.result.push(result)
    }
  }
}

PDFRetrievalRunner.create({
  parliaments: 'all'
})
  .execute()
  .then(results => {
    console.log(results)
  })