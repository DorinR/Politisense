import { mergeArrays, checkIsEmptyRawData } from '../../client/src/Components/Dashboard/Utilities/CommonUsedFunctions'
const Firestore = require('@firestore').Firestore

exports.getImageData = async (req, res) => {
  const name = req.params.name.toLowerCase()
  new Firestore()
    .Politician()
    .where('name', '==', name)
    .select()
    .then(snapshot => {
      if (snapshot.empty || snapshot.size > 1) {
        res.status(400).json({
          message: `Could not find: ${name}`,
          success: false,
          data: {}
        })
      } else {
        snapshot.forEach(doc => {
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

exports.getRepresentativeByRiding = (req, res) => {
  const db = new Firestore(true)
  const riding = req.params.riding.toLowerCase()
  db.Politician()
    .select('riding', '==', riding)
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'Riding Not Found',
          success: false
        })
      }
      snapshot.forEach(doc => {
        res.json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(console.error)
}
async function getAllRepsForEachParliament (parliamentNo) {
  const db = new Firestore(false).forParliament(parliamentNo)
  const politicians = []
  await db.Politician()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        return []
      }
      snapshot.forEach(doc => {
        politicians.push(doc.data())
      })
      return politicians
    })
  return politicians
}

exports.getAllRepsFromAllParliaments = async (req, res) => {
  const parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
  const rawData = await Promise.all(
    parliaments.map(parliament => {
      return getAllRepsForEachParliament(parliament)
    })
  )
  const jointArray = mergeArrays((rawData))

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
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        representativesAccumulator.push(doc.data())
      })

      if (!representativesAccumulator.empty) {
        res.status(200).json({
          data: representativesAccumulator,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err.message)
      res.status(400).json({
        data: representativesAccumulator,
        success: false
      })
      console.log(err)
    })
}

exports.getRepresentativesInfo = (req, res) => {
  const name = req.params.name.toLowerCase()
  let repInfo = {}
  const db = new Firestore()
  db.Politician()
    .select('name', '==', name)
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
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
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

exports.getRepresentativeId = async (req, res) => {
  const db = new Firestore()
  await db
    .Politician()
    .where('name', '==', req.params.representative)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'Representative not found'
        })
      }
      snapshot.forEach(doc => {
        res.status(200).json({
          success: true,
          data: doc.id
        })
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: err
      })
    })
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
  const db = new Firestore(false).forParliament(parliamentNo)
  let id = null
  await db.Politician()
    .where('name', '==', repName)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        return 'nothing there 1'
      }
      snapshot.forEach(doc => {
        id = doc.id
      })

      return id
    })
  return id
}

async function fetchrolesbyID (parliamentNo, id) {
  const db = new Firestore().forParliament(parliamentNo)
  const role = db.Role()
  const roles = []
  await role.where('politician', '==', id)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        return []
      }
      snapshot.forEach(doc => {
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
    .catch(err => {
      console.log('Error getting documents', err)
    })
  return roles
}

exports.getAllRolesByRep = async (req, res) => {
  const parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
  const rawData = await Promise.all(
    parliaments.map(parliament => {
      return fetchRolesByParliament(parliament, req.params.repName)
    })
  )
  if (checkIsEmptyRawData(rawData)) {
    res.status(200).json({
      success: true,
      data: rawData
    })
  } else {
    res.status(404)
      .json({
        success: false,
        message: 'no data found'
      })
  }
}
