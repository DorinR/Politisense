import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/representatives/:riding
// @desc  get representative by riding
// @access Public
router.get('/:riding/getRepresentative', controller.getRepresentativeByRiding)

module.exports = router
