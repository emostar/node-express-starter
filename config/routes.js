module.exports = function(app) {
  var user  = require('../app/controllers/user_controller')(app)
    , debug = require('../app/controllers/debug_controller')(app)

  // Setup the middleware
  var accessmw       = require('./middleware/access')
    , requireSession = [ accessmw.requireSession() ]

  // Log some extras on each request
  app.all('*', function(req, res, next) {
    req.kvLog.ip = req.ip
    next()
  })

  // The actual routes
  app.get('/user/list', requireSession, user.list)
  app.get('/health', debug.health)
}
