const UserController = require('./UserController')

module.exports = {
  userSignup: function (req, res) { return UserController.userSignup(req, res) },
  userLogin: function (req, res) { return UserController.userLogin(req, res) },
  googelLogin: function (req, res) { return UserController.googleLogin(req, res) },
  setRiding: function (req, res) { return UserController.setRiding(req, res) },
  check: function (req, res) { return UserController.check(req, res) }
}