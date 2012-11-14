var express  = require('express')
  , mongoose = require('mongoose')
  , pjson    = require('../package.json')
  , path     = require('path')

module.exports = function(app) {

  var dbUri = process.env.MONGOHQ_URL || 'mongodb://localhost/example'
  var db    = mongoose.connect(dbUri)

  app.configure(function() {
    app.set('version', pjson.version)
    app.set('views', __dirname + '/../app/views')
    app.set('view engine', 'jade')
    app.use(express.favicon())
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(app.router)
    app.use(express['static'](path.join(__dirname, 'public')))
  })

  // Set the DB models
  app.configure(function() {
    app.set('db', {
        'main'     : db
      , 'users'    : db.model('User')
    })
  })

  app.settings.db.users.bootstrap(app)

}
