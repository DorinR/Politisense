import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/ridings/getRidingCode/:riding
// @desc get riding code corresponding to the riding name passed in
// @access Public
router.get('/getRidingCode/:riding', controller.getRidingCode)

// @route post api/ridings/getRidingPopulation/:riding
// @desc get the population of the riding passed in
// @access Public
router.get('/getRidingPopulation/:riding', controller.getRidingPopulation)

router.get('/getRidingByRidingCode',controller.getRidingByRidingCode)
module.exports = router
