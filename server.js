require('longjohn')
require('./lib/exception')

var app = require('./config/app')()
app.listen(app.set('port'))

console.log('\x1b[36mStarterProject v%s\x1b[0m running as \x1b[1m%s\x1b[0m',
  app.set('version'),
  app.set('ENV')
)
