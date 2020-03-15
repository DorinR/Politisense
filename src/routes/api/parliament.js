import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/parliament/getCabinetMinisters
// @desc  get all cabinet members
// @access Public
router.get('/getCabinetMinisters', controller.getCabinetMinisters)

// @route get api/parliament/getPartyInfo
// @desc  get information about current parties
// @access Public
router.get('/getPartyInfo', controller.getPartyInfo)

// @route post api/parliament/getRoleDescription
// @desc  get descriptions of all cabinet positions
// @access Public
router.post('/getRoleDescription', controller.getRoleDescription)

module.exports = router
