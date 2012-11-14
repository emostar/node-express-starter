var controller = {}
  , app
  , db
  , logger

module.exports = function(_app) {
  app    = _app
  db     = app.set('db')
  logger = app.set('logger')
  return controller
}

controller.list = function (req, res, next) {
  // TODO Some real work here
  db.users.find({}, gotUsers)

  function gotUsers(err, users) {
    if (err) return next(err)

    res.send(users)
  }
}
