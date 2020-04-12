import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/representatives/:riding/getRepresentative
// @desc  get representative by riding
// @access Public
router.get('/:riding/getRepresentative', controller.getRepresentativeByRiding)

// @route post api/representatives/:riding/getRepresentative
// @desc  get representative by riding
// @access Public
router.get('/getCabinetMinisters', controller.getCabinetMinisters)

// @route post api/getAllRepresentatives
// @desc  get all representatives currently stored in DB
// @access Public
router.get('/getAllRepresentatives', controller.getAllRepresentatives)

router.get('/:name/getRepresentativesInfo', controller.getRepresentativesInfo)
// @route post api/:representative/getRepresentativeId
// @desc get id of representative
// @access Public
router.get(
  '/:representative/getRepresentativeId',
  controller.getRepresentativeId
)

// @route post api/representatives/representative/representative/:name
// @desc get image of specific mp
// @access Public
router.get('/representative/representative/:name', controller.getImageData)

<<<<<<< Updated upstream
// @route post api/representatives/:repName/getAllRolesByRep
// @desc  get all roles for specific mp
// @access Public
router.get('/:repName/getAllRolesByRep', controller.getAllRolesByRep)

// @route post api/representatives/getAllRepsFromAllParliaments
// @desc get all reps from all parliaments
// @access Public
router.get(
  '/getAllRepsFromAllParliaments',
  controller.getAllRepsFromAllParliaments
)

router.get('/representative/voting-history/:representative', controller.representativeVotingHistory)
=======
router.get('/getAllRepsFromAllParliaments', controller.getAllRepsFromAllParliaments)
>>>>>>> Stashed changes

module.exports = router
