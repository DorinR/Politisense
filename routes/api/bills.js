import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/bills/getBillById
// @desc  get bill by bill ID
// @access Public
router.post('/getBillById', controller.getBillById)

// @route post api/bills/getBillsBySponsor
// @desc  get bill by sponsor name
// @access Public
router.post('/getBillsBySponsor', controller.getBillsBySponsor)

// @route post api/bills/getBillsBySponsor
// @desc  get bill by sponsor name
// @access Public
router.post('/filterBillsByCategory', controller.filterBillsByCategory)

module.exports = router
