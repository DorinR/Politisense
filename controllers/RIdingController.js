import { Firestore } from '../client/src/Firebase'
import represent from 'represent'
import ridingCodes from '../client/src/Components/Dashboard/Sidebar/RidingShape/RidingCodes'

exports.saveRidingCodesToFirestore = (req, res) => {
  const ridingCodesLowerCase = []
  ridingCodes.forEach(ridingObject => {
    const { code, nameEnglish, nameFrench, population } = ridingObject
    const lowerCaseRidingObject = {
      code: code,
      nameEnglish: nameEnglish.toLowerCase(),
      nameFrench: nameFrench.toLowerCase(),
      population: population
    }
    ridingCodesLowerCase.push(lowerCaseRidingObject)
  })

  const db = new Firestore()
  const allPromisesForInsertions = []
  ridingCodesLowerCase.forEach(ridingObject => {
    allPromisesForInsertions.push(db.Ridings().insert(ridingObject))
  })

  Promise.all(allPromisesForInsertions)
    .then(
      response => {
        res.status(200).json({
          success: true
        })
      },
      error => {
        res.status(400).json({
          success: false,
          message: error
        })
      }
    )
    .catch(err => {
      console.error(err)
    })
}

exports.getRidingCode = (req, res) => {
  const targetRiding = req.params.riding.replace(/—/g, '--')

  const db = new Firestore()
  db.Ridings()
    .select('nameEnglish', '==', targetRiding)
    .then(
      snapshot => {
        if (snapshot.empty) {
          res.status(404).json({
            success: false,
            message: 'Riding not found'
          })
        }
        snapshot.forEach(doc => {
          res.status(200).json({
            success: true,
            data: doc.data()
          })
        })
      },
      err => {
        console.error(err)
        res.status(404).json({
          success: false,
          message: 'There was an error fetching the riding code'
        })
      }
    )
    .catch(err => {
      res.status(400).json({
        success: false,
        message: 'Error Fetching Riding Code'
      })
      console.error(err)
    })
}

exports.getRidingSimpleShape = (req, res) => {
  console.log('getRidingSimpleShape endpoint hit!')
  const ridingCode = req.params.ridingCode
  console.log('getting shape for riding number:', ridingCode, '...')
}