import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/parliament/getCabinetMinisters
// @desc  get representative by riding
// @access Public
router.get('/getCabinetMinisters', controller.getCabinetMinisters)

// @route post api/parliament/getCabinetMinisters
// @desc  get representative by riding
// @access Public
router.get('/getPartyInfo', controller.getPartyInfo)

// @route post api/parliament/getCabinetMinisters
// @desc  get representative by riding
// @access Public
router.post('/getRoleDescription', controller.getRoleDescription)

module.exports = router
