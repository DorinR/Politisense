import express from 'express'
const router = express.Router()

// @route GET api/users
// @desc Register User
// @access Public
router.get('/', (req, res) => res.send('user route'))

module.exports = router
