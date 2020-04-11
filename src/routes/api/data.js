import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

router.post('/', (req, res) => res.send('data route test'))
router.post('/:parliament/:type/:category', controller.dataIndex)
router.post('/:parliament/:type/:category/update', controller.update)

module.exports = router
