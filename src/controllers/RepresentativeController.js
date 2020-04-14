import {
  mergeArrays,
  checkIsEmptyRawData
} from '../../client/src/Components/Dashboard/Utilities/CommonUsedFunctions'
const Firestore = require('@firestore').Firestore
const Utils = require('./util/ActivityVotingUtils')

exports.getImageData = async (req, res) => {
  const name = req.params.name.toLowerCase()
  new Firestore()
    .Politician()
    .where('name', '==', name)
    .select()
    .then((snapshot) => {
      if (snapshot.empty || snapshot.size > 1) {
        res.status(400).json({
          message: `Could not find: ${name}`,
          success: false,
          data: {}
        })
      } else {
        snapshot.forEach((doc) => {
          res.status(200).json({
            message: `Found Politician: ${name}`,
            success: true,
            data: doc.data()
          })
        })
      }
    })
    .catch(console.error)
}
const Parliaments = require('@parameter').Parliament.Number

function getPolitician (snapshot) {
  if (snapshot.empty || snapshot.size > 1) {
    return null
  }
  let politician = null
  snapshot.forEach(doc => {
    politician = doc.data()
  })
  return politician
}

exports.getMpByRiding = (req, res) => {
  const db = new Firestore()
  const riding = req.params.riding.toLowerCase()
  return db
    .Politician()
    .select('riding', '==', riding)
    .then((snapshot) => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'Riding Not Found',
          success: false
        })
      }
      snapshot.forEach((doc) => {
        res.json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(console.error)
}

exports.getRepresentativeByRiding = async (req, res) => {
  const riding = req.params.riding.toLowerCase()
  const politician = await new Firestore()
    .Politician()
    .where('riding', '==', riding)
    .select()
    .then(getPolitician)
    .catch((e) => {
      console.error(e)
      return null
    })

  if (!politician) {
    Utils.error(res, `MP not found for riding: ${riding}`)
    return
  }

  const start = await Promise.all(
    Parliaments.map(parliament => {
      return new Firestore()
        .forParliament(parliament)
        .Politician()
        .where('name', '==', politician.name)
        .select()
        .then(getPolitician)
        .then(politician => {
          if (!politician) throw new Error(`Politician not found in parliament ${parliament}`)
          return politician.start
        })
        .catch(() => {
          return -1
        })
    })
  )
    .then(startDates => {
      return startDates
        .filter(startDate => { return startDate > 0 })
        .sort()[0]
    })
    .catch(e => {
      console.error(e)
      return null
    })

  if (!start) {
    Utils.error(res, `Could not locate correct start date for politician: ${politician.name}`)
    return
  }

  politician.start = start
  Utils.success(res, `Returning Politicians ${politician.name}`, politician)
}

async function getAllRepsForEachParliament (parliamentNo) {
  const db = new Firestore().forParliament(parliamentNo)
  const politicians = []
  await db
    .Politician()
    .select()
    .then((snapshot) => {
      if (snapshot.empty) {
        return []
      }
      snapshot.forEach((doc) => {
        politicians.push(doc.data())
      })
      return politicians
    })
  return politicians
}

exports.getAllRepsFromAllParliaments = async (req, res) => {
  const parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
  const rawData = await Promise.all(
    parliaments.map((parliament) => {
      return getAllRepsForEachParliament(parliament)
    })
  )
  const jointArray = mergeArrays(rawData)

  res.status(200).json({
    success: true,
    data: jointArray
  })
}

exports.getAllRepresentatives = (req, res) => {
  const representativesAccumulator = []
  const db = new Firestore()
  db.Politician()
    .select()
    .then((snapshot) => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach((doc) => {
        representativesAccumulator.push(doc.data())
      })

      if (!representativesAccumulator.empty) {
        res.status(200).json({
          data: representativesAccumulator,
          success: true
        })
      }
    })
    .catch((err) => {
      console.error(err.message)
      res.status(400).json({
        data: representativesAccumulator,
        success: false
      })
      console.log(err)
    })
}

exports.getPastRepresentatives = async (req, res) => {
  const representativesAccumulator = []
  const parliaments = [36, 37, 38, 39, 40, 41, 42]
  const db = new Firestore()
  const politicians = await Promise.all(parliaments.map(parl => {
    return db
      .forParliament(parl)
      .Politician()
      .where('riding', '==', req.params.riding)
      .select()
      .then(snapshot => {
        let ret = {}
        snapshot.forEach(doc => {
          ret = doc.data()
        })
        return ret
      })
  }))

  politicians.forEach(pol => {
    if (Object.keys(pol).length !== 0) {
      representativesAccumulator.push(pol)
    }
  })
  if (representativesAccumulator.length === 0) {
    res.status(404).json({
      success: false,
      message: 'No politicians found for those ridings'
    })
  } else {
    res.status(200).json({
      data: representativesAccumulator,
      success: true
    })
  }
}

exports.getRepresentativesInfo = (req, res) => {
  const name = req.params.name.toLowerCase()
  let repInfo = {}
  const db = new Firestore()
  db.Politician()
    .select('name', '==', name)
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach((doc) => {
        const {
          name,
          politicalParty,
          riding,
          yearElected,
          imageUrl
        } = doc.data()
        repInfo = {
          name: name,
          politicalParty: politicalParty,
          riding: riding,
          yearElected: yearElected,
          imageUrl: imageUrl
        }
      })
      res.status(200).json({
        data: repInfo,
        success: true
      })
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err
      })
    })
}

exports.getRepresentativeId = async (req, res) => {
  const db = new Firestore()
  await db
    .Politician()
    .where('name', '==', req.params.representative)
    .select()
    .then((snapshot) => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'Representative not found'
        })
      }
      snapshot.forEach((doc) => {
        res.status(200).json({
          success: true,
          data: doc.id
        })
      })
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err
      })
    })
}

exports.getPastRepresentativeId = async (req, res) => {
  const parliaments = [36, 37, 38, 39, 40, 41, 42]
  const db = new Firestore()
  parliaments.map(parl => {
    return db
      .forParliament(parl)
      .Politician()
      .where('name', '==', req.params.name)
      .where('start', '==', req.body.start)
      .select()
      .then(snapshot => {
        snapshot.forEach(doc => {
          res.status(200).json({
            success: true,
            data: doc.id
          })
        })
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err
        })
      })
  })
}

exports.getRepresentativesDateEntryParliament = async (req, res) => {
  const name = req.params.name.toLowerCase()
  const parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
  const rawData = await Promise.all(
    parliaments.map((parliament) => {
      return findRepForSpecificParliament(parliament, name)
    })
  )
  const jointArray = mergeArrays(rawData)
  const dayEntryParliament = Math.min.apply(
    Math,
    jointArray.map(function (o) {
      return o
    })
  )
  res.status(200).json({
    success: true,
    data: dayEntryParliament
  })
}

async function findRepForSpecificParliament (parliament, name) {
  const db = new Firestore().forParliament(parliament)
  const politicians = []
  await db
    .Politician()
    .where('name', '==', name)
    .select()
    .then((snapshot) => {
      if (snapshot.empty) {
        return []
      }
      snapshot.forEach((doc) => {
        politicians.push(doc.data().start)
      })

      return politicians
    })
  return politicians
}
exports.votingHistory = async (req, res) => {
  if (!req.params.representative) {
    Utils.error(res, 400, 'invalid request')
    return
  }
  const parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
  const allBills = parliaments.map((parliament) => {
    return new Firestore().forParliament(parliament).Bill().select()
  })
  Promise.all(
    parliaments.map((parliament) => {
      return new Promise((resolve) => {
        new Firestore()
          .forParliament(parliament)
          .Politician()
          .where('name', '==', req.params.representative)
          .select()
          .then((snapshot) => {
            return getMemberIDInParliament(snapshot)
          })
          .then((id) => {
            if (!id) resolve([])
            return joinVotesToVoteRecords(id, parliament)
          })
          .then((votes) => {
            const index = parliaments.indexOf(parliament)
            return addBillData(votes, allBills, index)
          })
          .then((votes) => {
            return votes.map(createExpectedRecord).filter(isRecordComplete)
          })
          .then(resolve)
      })
    })
  )
    .then((votes) => {
      Utils.success(res, 'successfully retrieved votes', votes.flat())
    })
    .catch((e) => {
      console.error(e)
      Utils.error(res, 500, 'internal server error')
    })
}

function getMemberIDInParliament (snapshot) {
  if (snapshot.empty || snapshot.size > 1) {
    return null
  }
  let id = null
  snapshot.forEach((doc) => {
    id = doc.id
  })
  return id
}

function addBillData (votes, allBills, index) {
  const voteMap = mapVotesByBill(votes)
  const billIDs = Object.keys(voteMap)
  return Promise.resolve(allBills[index]).then((snapshot) => {
    addBillDataToMap(voteMap, billIDs, snapshot)
    return Object.values(voteMap)
  })
}

function joinVotesToVoteRecords (id, parliament) {
  const db = new Firestore().forParliament(parliament)
  const memberVotes = db.Vote().where('member', '==', id)
  return db
    .VoteRecord()
    .innerJoin('_id', memberVotes, 'vote')
    .then((results) => {
      return results
    })
}

function addBillDataToMap (voteMap, billIDs, snapshot) {
  snapshot.forEach((doc) => {
    if (billIDs.includes(doc.id)) {
      voteMap[doc.id].bill = doc.data()
    }
  })
}

function mapVotesByBill (votes) {
  const voteMap = {}
  votes.forEach((vote) => {
    voteMap[vote.bill] = vote
  })
  return voteMap
}

function createExpectedRecord (vote) {
  return {
    number: vote.billNumber,
    title: vote.bill.title,
    dateVoted: vote.bill.dateVoted,
    link: vote.bill.link,
    name: vote.name,
    sponsorName: vote.sponsorAffiliations,
    result: vote.yeas > vote.nays,
    vote: vote.yea,
    paired: vote.paired
  }
}

function isRecordComplete (vote) {
  return vote.dateVoted && vote.number
}

async function fetchRolesByParliament (parliamentNo, repName) {
  const id = await fetchIDbyRepName(parliamentNo, repName)
  if (id) {
    const roles = await fetchrolesbyID(parliamentNo, id)
    return roles
  }
  return []
}

async function fetchIDbyRepName (parliamentNo, repName) {
  const db = new Firestore().forParliament(parliamentNo)
  let id = null
  await db
    .Politician()
    .where('name', '==', repName)
    .select()
    .then((snapshot) => {
      if (snapshot.empty) {
        return 'nothing there 1'
      }
      snapshot.forEach((doc) => {
        id = doc.id
      })

      return id
    })
  return id
}

async function fetchrolesbyID (parliamentNo, id) {
  const roles = []
  return new Firestore()
    .forParliament(parliamentNo)
    .Role()
    .where('politician', '==', id)
    .select()
    .then((snapshot) => {
      if (snapshot.empty) {
        return []
      }
      snapshot.forEach((doc) => {
        const { fromDate, group, title, toDate, type } = doc.data()
        const test = {
          fromDate: fromDate,
          group: group,
          title: title,
          toDate: toDate,
          type: type
        }
        roles.push(test)
      })
      return roles
    })
}

exports.getAllRolesByRep = async (req, res) => {
  const parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
  const rawData = await Promise.all(
    parliaments.map((parliament) => {
      return fetchRolesByParliament(parliament, req.params.repName)
    })
  )
  if (checkIsEmptyRawData(rawData)) {
    res.status(200).json({
      success: true,
      data: rawData
    })
  } else {
    res.status(404).json({
      success: false,
      message: 'no data found'
    })
  }
}
