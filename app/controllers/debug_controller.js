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

controller.health = function (req, res, next) {
  res.send({
      memory      : process.memoryUsage()
    , versions    : process.version
    , uptime      : process.uptime()
    , connections : req.socket.server.connections
  })
}