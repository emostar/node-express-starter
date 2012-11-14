var express = require('express')

exports.requireSession = function() {
  return function (req, res, next) {
    var session = req.param('session_id')

    if (!session) return next(new Error('No session found'))

    req.app.settings.db.users.findOne({session: session}, gotUser)

    function gotUser(err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Session does not exist anymore'))
      req.user = user

      // Log the user
      req.kvLog.user_id = req.user._id.toString()

      next()
    }
  }
}
