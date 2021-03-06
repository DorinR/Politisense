import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/votes/:representativeId/:billId/getRepresentativeVoteOnBill
// @desc  get the vote of the given representative on the given bill
// @access Public
router.get(
  '/:representativeId/getAllVotesByRepresentative',
  controller.getAllVotesByRepresentative
)

router.get(
  '/:member/getPastRepresentativeVotes',
  controller.getPastRepresentativeVotes
)

router.get(
  '/:member/getPastRepresentativePairedVotes',
  controller.getPastRepresentativePairedVotes
)

module.exports = router
