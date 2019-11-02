import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/voteRecord/getVotesByRepresentative
// @desc  get the list of bills that a given representative has voted on
// @access Public
router.get('/getVotesByRepresentative', controller.getVotesByRepresentative)

module.exports = router
