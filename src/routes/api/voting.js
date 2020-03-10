import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

router.post('/index', controller.index)

module.exports = router