const utils = require('./util/ActivityVotingUtils')

module.exports.index = async (req, res) => {
  if (!utils.validateRequestParameters(req, res)) {
    return
  }

  const user = await utils.validateUser(req, res)
  if (!user) {
    return
  }

  let { newActivities, userVotes, storedActivities } = await utils.getActivityRecords(req, res, user)
  if (!newActivities || !userVotes || !storedActivities) {
    return
  }

  const activityMap = utils.duplicateActivityMap(storedActivities)
  const voteMap = utils.userVoteExistsMap(userVotes)

  newActivities = newActivities
    .map(activity => {
      return utils.replaceNewVotesWithExisting(activity, activityMap)
    })
    .map(activity => {
      return utils.addHasVotedTag(activity, voteMap)
    })

  utils.success(res, 'successfully retrieved activity list', newActivities)
}

module.exports.vote = async (req, res) => {
  if (!utils.validateRequestParameters(req, res) || !utils.validateUserVotingParameters(req, res)) {
    return
  }
  const user = await utils.retrieveUser(res, req.body.user.email)
  if (!user) {
    return
  }
  user.vote = req.body.vote

  let activity = await utils.getExistingActivity(req, res)
  if (activity && Object.keys(activity).length === 0) {
    activity = await utils.insertNewActivity(req, res)
  }
  if (!activity) {
    return
  }

  if (await utils.canUserVoteOnActivity(user, activity)) {
    console.log('activity ', activity)
    await utils.insertNewVote(user, activity)
    await utils.countVote(user, activity)
    utils.success(res, 'vote successfully registered', {})
  } else {
    utils.error(res, 400, 'cannot vote on this activity or have already voted')
  }
}
