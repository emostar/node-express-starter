var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , bcrypt = require('bcrypt')
  , app

var User = module.exports = new Schema({
    email      : {type: String, unique: true}
  , password   : {type: String}
  , created_at : {type: Date, default: Date.now}
  , updated_at : {type: Date, default: Date.now}
})

User.statics.bootstrap = function(_app) {
  app = _app
}

User.methods.setPassword = function (password, callback) {
  var self = this
    , work = 10

  if (typeof password !== 'string' || password.length === 0) {
    return callback(new Error('Invalid password'))
  }

  if (app.settings.ENV === 'test') {
    work = 1
  }

  bcrypt.genSalt(work, gotSalt)

  function gotSalt(err, salt) {
    if (err) return callback(err)

    bcrypt.hash(password, salt, gotHash)
  }

  function gotHash(err, hash) {
    if (err) return callback(err)

    self.password = hash
    callback()
  }
}

User.methods.checkPassword = function (password, callback) {
  if (typeof password !== 'string' || password.length === 0) {
    return callback(new Error('Invalid password'))
  }

  bcrypt.compare(password, this.password, callback)
}
