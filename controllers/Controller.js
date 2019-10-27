const UserController = require('./UserController')

module.exports = {

  // User
  userSignup: function (req, res) { return UserController.userSignup( req, res) }

}
