const LegislativeActivityScraper = require('@data').Scrapers.LegislativeActivityScraper
const Firestore = require('@firestore').Firestore
const Models = require('@model')

export function error (response, status, message) {
  console.error(message)
  response
    .status(status)
    .json({
      success: false,
      message: message,
      data: null
    })
}

export function success (response, message, data) {
  response
    .status(200)
    .json({
      success: true,
      message: message,
      data: data
    })
}

export function records (collection) {
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

export function retrieveUser (res, email) {
  return new Firestore(false).User()
    .where('email', '==', email)
    .select()
    .then(snapshot => {
      if (snapshot.size > 1) {
        error(res, 400, 'User is not Unique')
        return null
      }
      if (snapshot.empty) {
        error(res, 400, 'user does not exist')
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

export function validateRequestParameters (req, res) {
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

export function validateUser (req, res) {
  return retrieveUser(res, req.body.user.email)
}

export function getNewActivities () {
  return LegislativeActivityScraper.create().execute()
}

export function getUserActivityVotes (userID) {
  const savedActivitiesCollection = new Firestore().LegislativeActivityVote().where('user', '==', userID)
  return records(savedActivitiesCollection)
}

export function getSavedActivities () {
  return records(new Firestore().LegislativeActivity())
}

export function duplicateActivityMap (storedActivities) {
  const activityMap = {}
  storedActivities.forEach(act => {
    activityMap[act.data.title] = act.data
  })
  return activityMap
}

export function userVoteExistsMap (userVotes) {
  const voteMap = {}
  userVotes.forEach(vote => {
    voteMap[vote.activity] = true
  })
  return voteMap
}

export function getActivityRecords (req, res, user) {
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

export function replaceNewVotesWithExisting (activity, activityMap) {
  if (Object.keys(activityMap).includes(activity.title) &&
      Object.values(activityMap).includes(activity.description)) {
    return activityMap[activity.title]
  } else {
    activity.yes = 0
    activity.no = 0
    return activity
  }
}
export function addHasVotedTag (activity, voteMap) {
  if (Object.keys(voteMap).includes(activity.id)) {
    activity.data.userHasVoted = true
    return activity.data
  }
  activity.userHasVoted = false
  return activity
}

export function validateUserVotingParameters (req, res) {
  if (!req.body.activity || !req.body.activity.title || !req.body.activity.description) {
    error(res, 400, 'No activity, or incomplete activity Provided')
  } else if (!req.body.vote) {
    error(res, 400, 'Must supply a vote result')
  } else if (!req.body.user || !req.body.user.email) {
    error(res, 400, 'Must supply valid user')
  } else {
    return true
  }
  return false
}

export function getExistingActivity (req, res) {
  const title = req.body.activity.title
  const description = req.body.activity.description
  return new Firestore()
    .LegislativeActivity()
    .where('title', '==', title)
    .where('description', '==', description)
    .select()
    .then(snapshot => {
      if (snapshot.size > 1) {
        error(res, 500, 'multiple activity records present on server')
        return null
      } else if (snapshot.empty) {
        return {}
      } else {
        let activity = null
        snapshot.forEach(doc => {
          activity = {
            id: doc.id,
            data: doc.data()
          }
        })
        return activity
      }
    })
}

export function insertNewActivity (req, res) {
  const activity = req.body.activity
  delete activity.userHasVoted
  return new Firestore()
    .LegislativeActivity()
    .insert(activity)
    .then(id => {
      return {
        id: id,
        data: activity
      }
    })
    .catch(e => {
      console.error(e)
      error(res, 500, 'could not register vote.')
      return null
    })
}

export function canUserVoteOnActivity (user, activity) {
  const db = new Firestore()
  return db.LegislativeActivityVote()
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
}

export function insertNewVote (user, activity) {
  return new Firestore()
    .LegislativeActivityVote()
    .insert(
      new Models.ActivityVote(user.id, activity.id)
    )
}

export function countVote (user, activity) {
  const collection = new Firestore()
    .LegislativeActivity()
    .where('title', '==', activity.data.title)
    .where('description', '==', activity.data.description)
  if (user.vote === 'yes') {
    return collection.update({
      yes: activity.data.yes + 1
    })
  } else if (user.vote === 'no') {
    return collection.update({
      no: activity.data.no + 1
    })
  }
}
