import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/mapSupportData/:type/getMapSupportData
// @desc get requested map support data (shape data or election results data)
// @access Public
router.get('/:type/getMapSupportData', controller.getMapSupportData)

module.exports = router
