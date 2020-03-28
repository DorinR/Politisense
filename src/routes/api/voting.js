import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

router.post('/index', controller.index)
router.post('/vote', controller.vote)

module.exports = router
