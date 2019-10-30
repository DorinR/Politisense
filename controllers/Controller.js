const UserController = require('./UserController')

module.exports = {

  // User
  userSignup: function (req, res) { return UserController.userSignup(req, res) },
  userLogin: function (req, res) { return UserController.userLogin(req, res) }

}
