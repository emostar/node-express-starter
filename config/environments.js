var express      = require('express')
  , reqLogger    = require('express-request-logger')
  , winston      = require('winston')
  , redis        = require('redis')
  , kue          = require('kue')
  , Mixpanel     = require('mixpanel')
  , nodemailer   = require('nodemailer')
  , redisInfo

require('winston-mail')
require('winston-loggly')
require('winston-papertrail')

if (process.env.REDIS_URL) {
  redisInfo      = require("url").parse(process.env.REDIS_URL)
  redisInfo.auth = redisInfo.auth.split(':')[1]
} else {
  redisInfo = {
      hostname: 'localhost'
    , port: 6379
    , auth: null
  }
}

module.exports = function(app) {

  var port = process.env.PORT || 4000
    , logger
    , mixpanelToken

  kue.redis.createClient = function() {
    var client = redis.createClient(
        redisInfo.port
      , redisInfo.hostname
    )
    if (redisInfo.auth) {
      client.auth(redisInfo.auth)
    }
    return client
  }
  app.set('kue', kue.createQueue())

  // ----- Local dev environment
  app.configure('local', function() {
    logger = new (winston.Logger)({
      transports: [
          new (winston.transports.Console)()
      ]
    })

    app.use(reqLogger.create(logger))
    app.set('port', port)
    app.set('domain', 'localhost:4000')
    app.set('ENV', 'local')
    app.set('environment', 'Running local environment')
    app.set('secret', 'TODO CHANGE THIS!')

    app.use(express.errorHandler({ showStack: true, dumpExceptions: true }))

    mixpanelToken = 'notreal'
  })

  // ----- Test environment
  app.configure('test', function() {
    logger = new (winston.Logger)({
      transports: [
      ]
    })

    app.use(reqLogger.create(logger))
    app.set('port', port)
    app.set('domain', 'testing.localhost')
    app.set('ENV', 'test')
    app.set('environment', 'Running test environment')
    app.set('secret', 'testing')

    app.use(express.errorHandler())

    mixpanelToken = 'notreal'
  })

  // ----- Production environment
  app.configure('production', function() {
    logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Loggly)({
            subdomain: 'example'
          , inputToken: 'example'
          , level: 'info'
          , json: true
        }),
        new (winston.transports.Mail)({
            to       : 'user@example.com'
          , from     : 'winston@example.com'
          , host     : 'smtp.sendgrid.net'
          , port     : 587
          , tls      : true
          , username : process.env.SENDGRID_USERNAME
          , password : process.env.SENDGRID_PASSWORD
          , level    : 'error'
          }),
        new (winston.transports.Console)(),
        new (winston.transports.Papertrail)({
            host: 'logs.papertrailapp.com'
          , port: process.env.PAPERTRAIL_PORT
        })
      ]
    })

    app.use(reqLogger.create(logger))
    app.set('port', port)
    app.set('domain', 'example.com')
    app.set('ENV', 'production')
    app.set('environment', 'Running production environment')
    app.set('secret', 'TODO CHANGE THIS')

    app.use(express.errorHandler())

    mixpanelToken = 'TODO CHANGE THIS'
  })

  app.set('mailer', nodemailer.createTransport('SMTP', {
      host   : 'smtp.sendgrid.net'
    , port   : 587
    , auth   :
      { user : process.env.SENDGRID_USERNAME
      , pass : process.env.SENDGRID_PASSWORD
      }
  }))

  if (logger) {
    app.set('logger', logger)
  }

  if (mixpanelToken) {
    app.set('mixpanel', Mixpanel.init(mixpanelToken))
  }

  return app
}
