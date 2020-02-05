import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

router.get('/budget/:id', controller.getBudgetData)

module.exports = router
