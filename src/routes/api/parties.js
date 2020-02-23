import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/parties/getPartyData
// @desc get all data for given party
// @access Public
router.get('/:party/getAllPartyData', controller.getAllPartyData)

module.exports = router
