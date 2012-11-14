var mongoose = require('mongoose')

module.exports = function(app) {

  mongoose.model('User', require('../app/models/user'))

}

