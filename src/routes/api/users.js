import express from 'express'

const router = express.Router()
const controller = require('../../controllers/Controller')

router.get('/', (req, res) => res.send('user route'))
router.post('/signup', controller.userSignup)
router.post('/login', controller.userLogin)
router.post('/socialLogin', controller.socialLogin)
router.post('/setRiding', controller.setRiding)
router.post('/checkIfUserExists', controller.checkIfUserExists)
router.post('/checkUserVerified', controller.checkUserVerified)
router.post('/activateAccount', controller.activateAccount)
router.post('/generateActivationLink', controller.generateActivationLink)
router.post('/generateResetLink', controller.generateResetLink)
router.post('/checkTokenValid', controller.checkTokenValid)

// @route post api/users/signup
// @desc  signup User
// @access Public
router.post('/signup', controller.userSignup)
router.post('/login', controller.userLogin)
router.post('/socialLogin', controller.socialLogin)

// @route get api/users/:userEmail/getUser
// @desc  get user by email
// @access Public
router.get('/:userEmail/getUser', controller.getUserByEmail)

// @route POST api/users/:userEmail/getUser
// @desc  get user by email
// @access Public
router.post('/updateUser', controller.updateUser)

// @route POST api/users/updateUserRiding
// @desc update user riding
// @access Public
router.put('/updateUserRiding', controller.updateUserRiding)

// @route POST api/users/getUserInterests
// @desc  get user categories by email
// @access Public
router.post('/getUserInterests', controller.getUserInterests)

// @route POST api/users/:userEmail/getUser
// @desc  updating us categories
// @access Public
router.post('/updateUserCategory', controller.updateUserCategory)

module.exports = router
