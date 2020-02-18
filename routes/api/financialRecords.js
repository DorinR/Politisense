import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/financialRecords/getAllSpendingItems
// @desc get all spending items stored in FinancialRecords collection
// @access Public
router.get('/getAllSpendingItems', controller.getAllSpendingItems)

module.exports = router
