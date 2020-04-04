import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

router.get('/budget/:id', controller.getBudgetData)

router.post('/budget/:member/fetchMemberExpenditures',
    controller.fetchMemberExpenditures
)

module.exports = router
