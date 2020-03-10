const LegislativeActivityScraper = require('@data').Scrapers.LegislativeActivityScraper
const Firestore = require('@firestore').Firestore
const Models = require('@model')

function error (response, status, message) {
  response
    .status(status)
    .json({
      success: false,
      message: message,
      data: null
    })
}

function records (collection) {
  return collection
    .select()
    .then(snapshot => {
      const activities = []
      snapshot.forEach(doc => {
        activities.push({
          id: doc.id,
          data: doc.data()
        })
      })
      return activities
    })
    .catch(e => {
      console.error(e.message)
      return []
    })
}

function retrieveUser (res, email) {
  return new Firestore(false).User()
    .where('email', '==', email)
    .select()
    .then(snapshot => {
      if (snapshot.empty || snapshot.size > 1) {
        error(res, 400, 'User is not Unique')
        return null
      }
      let user = {}
      snapshot.forEach(doc => {
        user = {
          data: doc.data(),
          id: doc.id
        }
      })
      return user
    })
    .catch(e => {
      console.error(e.message)
      error(res, 500, e.message)
      return null
    })
}

function checkRequestParams (req, res) {
  if (!req.body.user) {
    error(res, 400, 'User not defined in passed parameters')
    return false
  }
  if (!req.body.user.email) {
    error(res, 400, 'Malformed user in passed parameters')
    return false
  }
  return true
}

function validateUser(req,res) {
  return retrieveUser(res, req.body.user.email)
}

function getNewActivities () {
  return LegislativeActivityScraper.create().execute()
}

function getUserActivityVotes (userID) {
  const savedActivitiesCollection = new Firestore().LegislativeActivityVote().where('user', '==', userID)
  return records(savedActivitiesCollection)
}

function getSavedActivities() {
  return records(new Firestore().LegislativeActivity())
}

function duplicateActivityMap (storedActivities) {
  const activityMap = {}
  storedActivities.forEach(act => {
    activityMap[act.data.title] = act.data
  })
  return activityMap
}

function userVoteExistsMap (userVotes) {
  const voteMap = {}
  userVotes.forEach(vote => {
    voteMap[vote.activity] = true
  })
  return voteMap
}

function getActivityRecords(req, res, user) {
  return Promise.all([
    getNewActivities(),
    getUserActivityVotes(user.id),
    getSavedActivities()
  ])
    .then(responses => {
      return {
        newActivities: responses[0][0].data[0],
        userVotes: responses[1],
        storedActivities: responses[2]
      }
    })
    .catch(e => {
      console.error(e.message)
      error(res, 500, 'ERROR: unexpected error occurred when fetching activities')
      return null
    })
}

function replaceNewVotesWithExisting (activity, activityMap) {
  if (Object.keys(activityMap).includes(activity.title)) {
    return activityMap[activity.title]
  } else {
    activity.yes = 0
    activity.no = 0
    return activity
  }
}
function addHasVotedTag(activity, voteMap) {
  if (Object.keys(voteMap).includes(activity.id)) {
    activity.data.user_has_voted = true
    return activity.data
  }
  activity.user_has_voted = false
  return activity
}

module.exports.index = async (req, res) => {
  if (!checkRequestParams(req, res)) {
    return
  }

  const user = await validateUser(req, res)
  if (!user) {
    return
  }

  let { newActivities, userVotes, storedActivities } = await getActivityRecords(req, res, user)
  if (!newActivities || !userVotes || !storedActivities) {
    return
  }

  const activityMap = duplicateActivityMap(storedActivities)
  const voteMap = userVoteExistsMap(userVotes)

  newActivities = newActivities
    .map(activity => {
      return replaceNewVotesWithExisting(activity, activityMap)
    })
    .map(activity => {
      return addHasVotedTag(activity, voteMap)
    })
    .filter(activity => {
      return activity.no > 0 || activity.yes > 0
    })

  res
    .status(200)
    .json({
      success: true,
      data: newActivities
    })
}

module.exports.vote = async (req, res) => {
  console.log(req.body)
  if (!checkRequestParams(req, res)) {
    return
  }
  if (!req.body.activity) {
    error(res, 400, 'No activity Provided')
    return
  }

  if (!req.body.vote) {
    error(res, 400, 'Must supply a vote result')
    return
  }

  const user = await retrieveUser(res, req.body.user.email)
  if (!user) {
    return
  }

  const db = new Firestore(false).forParliament(43)
  const activities = db.LegislativeActivity()
  const activity = await activities
    .where('title', '==', req.body.activity.title)
    .select()
    .then(async snapshot => {
      if (snapshot.size > 1) {
        error(res, 500, 'multiple activity records present on server')
        return null
      }
      console.log(req.body.activity)
      if (snapshot.empty) {
        req.body.activity.yes = req.body.vote === 'yes' ? 1 : 0
        req.body.activity.no = req.body.vote === 'no' ? 1 : 0
        console.log(req.body.activity)
        const activity = Models.LegislativeActivity.deserialise(req.body.activity)
        await activities.insert(activity)
      }

      let activity = null
      snapshot.forEach(doc => {
        activity = {
          id: doc.id,
          data: doc.data()
        }
      })
      return activity
    })
    .catch(e => {
      console.error(e)
      error(res, 500, e.message)
      return null
    })

  if (!activity) {
    return
  }
  console.log(activity)
  const canVote = await db.LegislativeActivityVote()
    .where('user', '==', user.id)
    .where('activity', '==', activity.id)
    .select()
    .then(snapshot => {
      return snapshot.empty
    })
    .catch(e => {
      console.error(e)
      return false
    })
  console.log(canVote)
  if (canVote) {
    db.LegislativeActivityVote()
      .insert(new Models.ActivityVote(user.id, activity.id))
    db.LegislativeActivity()
      .where('title', '==', activity.data.title)
      .update({ title: activity.data.title })
    res
      .status(200)
      .json({
        success: true,
        message: 'vote successfully recorded'
      })
  } else {
    res
      .status(500)
      .json({
        success: false,
        message: 'cannot vote on the same bill more than once'
      })
  }
}
