import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/ridingShape/:version/getRidingShapes
// @desc get the riding shape for the given version
// @access Public
router.get('/:version/getRidingShapes', controller.getRidingShapes)

module.exports = router
