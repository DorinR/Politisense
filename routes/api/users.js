import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

router.get('/', (req, res) => res.send('user route'))
router.post('/signup', controller.userSignup)
router.post('/login', controller.userLogin)
router.post('/setRiding', controller.setRiding)
router.post('/check', controller.check)

// @route post api/users/signup
// @desc  signup User
// @access Public
router.post('/signup', controller.userSignup)
router.post('/login', controller.userLogin)

// @route post api/users/:userEmail/getUser
// @desc  get user by email
// @access Public
router.get('/:userEmail/getUser', controller.getUserByEmail)

module.exports = router
