var express      = require('express')
  , errors       = require('./errors')
  , config       = require('./config')
  , environments = require('./environments')
  , routes       = require('./routes')
  , models       = require('./models')

module.exports = function() {
  var app = express()

  models(app)

  environments(app)

  config(app)

  routes(app)

  errors(app)

  return app
}
