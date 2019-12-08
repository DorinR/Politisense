import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/ridings/getRidingCode
// @desc get riding code corresponding to the riding name passed in
// @access Public
router.get('/getRidingCode', controller.getRidingCode)

// @route post api/ridings/:ridingCode/getRidingSimpleShape
// @desc get the simple shape coordinates for the riding shape
// @access Public
router.get('/:ridingCode/getRidingSimpleShape', controller.getRidingSimpleShape)

// @route post api/saveRidingCodesToFirestore
// @desc save unique riding identification codes to firestore
// @access Public
router.post(
  '/saveRidingCodesToFirestore',
  controller.saveRidingCodesToFirestore
)

module.exports = router
