import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

router.get('/', (req, res) => res.send('user route'))
router.post('/signup', controller.userSignup)
router.post('/login', controller.userLogin)
router.post('/setRiding', controller.setRiding)
router.post('/check', controller.check)

module.exports = router
