import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/ridings/getRidingCode
// @desc get riding code corresponding to the riding name passed in
// @access Public
router.get('/getRidingCode/:riding', controller.getRidingCode)

module.exports = router
