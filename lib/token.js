var Db = require('./db.js');
var db = new Db();

var ttl = 1 * 60 * 60 * 1000
/*             H   MM   SS   MSMS */

function Token(opt) {
  if (typeof opt === 'string') {
    this.title = opt;
    return this;
  } else {
    for (prop in opt)
      this[prop] = opt[prop];
    return this;
  }
}

Token.prototype.init = function (req, user, callback) {
  this.user = user;
  this.username = user.name;
  this.ip = req.ip;
  this.timestamp = new Date().getTime();
  var sha = require('crypto').createHash('sha256');
  sha.update(this.user.name + this.ip + this.timestamp, 'utf8');
  this.title = sha.digest('base64');
  var self = this;
  db.remove({username: user.name}, 'tokens', {}, function (err) {
    db.insert(self, 'tokens', {}, function (err) {
      if (err) console.log(err);
      return callback(self);
    });
  });
};

Token.prototype.validate = function (req, callback) {
  var self = this;
  db.find({title: this.title}, 'tokens', {limit: 1}, function (err, docs) {
    if (err) console.log(err);
    if (docs.length < 1) return callback(false);
    self.user = docs[0].user;
    self.ip = docs[0].ip;
    self.timestamp = docs[0].timestamp;
    var sha = require('crypto').createHash('sha256');
    sha.update(self.user.name + req.ip + self.timestamp, 'utf8');
    if (self.title != sha.digest('base64')) {
      db.remove({title: self.title}, 'tokens', {}, function (err) {
        if (err) console.log(err);
      });
      return callback(false);
    }
    if (new Date().getTime() - self.timestamp > ttl) {
      db.remove({title: self.title}, 'tokens', {}, function (err) {
        if (err) console.log(err);
      });
      return callback(false);
    }
    return callback(true)
  });
};

Token.prototype.destruct = function (err) {
  db.remove({title: this.title}, 'tokens', {}, function (err) {
    return callback(err);
  });
}

module.exports = Token;