import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/bills/getBillById
// @desc  get bill by bill ID
// @access Public
router.get('/getBillById', controller.getBillById)

router.get('/:head/getAllBillsByHead', controller.getAllBillsByHead)

module.exports = router
