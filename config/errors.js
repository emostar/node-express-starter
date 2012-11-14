module.exports = function(app) {

  app.use(function(err, req, res, next) {
    var logger = req.app.settings.logger

    logger.error('An error has been caught', {err: err.stack || err.message})

    req.kvLog.error_handler = true

    if(req.app.set('ENV') !== 'production') {
      // Send detailed errors
      res.send({status: 'error', message: err.stack || err.message})
    } else {
      // Send the 500 page
      res.send({status: 'error', message: 'INTERNAL_ERROR'})
    }
  })

}
