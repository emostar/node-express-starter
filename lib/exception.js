var nodemailer = require('nodemailer')

process.on('uncaughtException', function(err) {
  var msg = ''

  if (err.message) msg += err.message + '\n'
  if (err.stack)   msg += 'Stack Trace:\n' + err.stack

  console.log(msg)

  if (process.env.NODE_ENV !== 'production') {
    return
  }

  var mailer = nodemailer.createTransport('SMTP', {
      host             : 'smtp.sendgrid.net'
    , port             : 587
    , auth             :
      { user : process.env.SENDGRID_USERNAME
      , pass : process.env.SENDGRID_PASSWORD
      }
  })

  var options = {
      from    : 'errors@example.com'
    , to      : 'user@example.com'
    , subject : 'Uncaught Exception'
    , text    : msg
    , headers : { 'X-SMTPAPI': { category: 'uncaught-exception' } }
  }

  mailer.sendMail(options, function(err, response) {
    if (err) console.log(err)
    process.exit(1)
  })
})