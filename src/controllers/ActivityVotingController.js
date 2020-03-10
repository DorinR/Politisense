const LegislativeActivityScraper = require('@data').Scrapers.LegislativeActivityScraper
const Firestore = require('@firestore').Firestore

function error(response, status, message) {
  response
    .status(status)
    .json({
      success: false,
      message: message,
      data: null
    })
}

function records(collection) {
  return collection
    .select()
    .then(snapshot => {
      let activities = []
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

module.exports.index = async (req, res) => {
  if(!req.body.user) {
    error(res, 400, 'User not defined in passed parameters')
    return
  }
  if(!req.body.user.email) {
    error(res, 400, 'Malformed user in passed parameters')
    return
  }
  const db = new Firestore(false).forParliament(43)

  const user_param = req.body.user
  const user = await db.User()
    .where('email', '==', user_param.email)
    .select()
    .then(snapshot => {
      if(snapshot.empty || snapshot.size > 1) {
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

  if(!user) {
    return
  }

  const userVoteCollection = db.LegislativeActivityVote().where('user', '==', user.id)

  const response = await Promise.all([
      LegislativeActivityScraper.create().execute(),
      records(userVoteCollection),
      records(db.LegislativeActivity()),
    ])
    .then(responses => {
      return {
        newActivities: responses[0],
        userVotes: responses[1],
        storedActivities: responses[2]
      }
    })
    .catch(e => {
      console.error(e.message)
      error(res, 500, e.message)
      return null
    })

  if(!response) {
    return
  }

  let {newActivities, userVotes, storedActivities} = response
  newActivities = newActivities[0].data[0]
  const activityMap = {}
  storedActivities.forEach(act => {
    activityMap[act.data.title] = act
  })
  const voteMap = {}
  userVotes.forEach(vote => {
    voteMap[vote.activity] = true
  })

  newActivities = newActivities
    .map(activity => {
      if(Object.keys(activityMap).includes(activity.title)) {
        return activityMap[activity.data.title]
      } else {
        activity.yes = 0
        activity.no = 0
        return activity
      }
    })
    .map(activity => {
      if(Object.keys(voteMap).includes(activity.id)) {
        activity.data['user_has_voted'] = true
        return activity.data
      }
      activity['user_has_voted'] = false
      return activity
    })

    res
      .status(200)
      .json({
        success: true,
        data: newActivities
      })

}