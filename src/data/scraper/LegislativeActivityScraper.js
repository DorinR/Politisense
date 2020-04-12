require('module-alias/register')
const QueueUtils = require('@manager')
const QueueManager = QueueUtils.QueueManager
const StartAction = QueueUtils.Start.LegislativeActivity
const StopAction = QueueUtils.Stop.Generic
const ErrorAction = QueueUtils.Error.Parse

class LegislativeActivityScraper extends QueueManager {
  static create (wait = 1000) {
    const manager = new LegislativeActivityScraper(wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new ErrorAction(manager))
    return manager
  }

<<<<<<< Updated upstream
=======
  accumulate (result) {
    if (result) {
      this.result.push(result)
    }
    return result
  }

>>>>>>> Stashed changes
  constructor (wait = 1000) {
    super(wait)
    this.params = [
      {
        url:
          'https://www.parl.ca/LegisInfo/RSSFeed.aspx?' +
          'download=rss&' +
          'Language=E&' +
          'Mode=1&' +
          'Source=LegislativeFilteredBills&' +
          'AllBills=1&' +
          'HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,' +
          '60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&' +
          'SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,' +
          '60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149&' +
          'RelInfo=MajSpeach,LOPLegSum,JRNLArt,DepartmentPressRel,SpeakRule,NewsArt,PartyPressRel,ComingIntoForce'
      }
    ]
    this.queryCount = this.params.length
  }
}

module.exports = {
  LegislativeActivityScraper: LegislativeActivityScraper
}
