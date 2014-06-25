var shard = {};
var Log = require('../log.js');
var Token = require('../token.js');
var User = require('../user.js');

shard.routes = [
  {
    path: '/status',
    method: 'GET',
    respond: function (req, res, db) {
      res.send({user: req.session.user, token: req.session.token});
    }
  },
  {
    path: '/login',
    method: 'POST',
    respond: function (req, res, db) {
      var user = new User({name: req.body.username}, req.body.password);
      user.auth(function (err) {
        if (typeof err !== 'undefined') {
          if (err.err === 'AUTH_FAILED') {
            var log = new Log(req, 'User auth failed.', 'AUTH_FAIL');
            log.store();
            return res.send({err: 'Invalid username or password'});
          } else {
            console.log(util.inspect(err));
            return res.status(500).send();
          }
        }
        var log = new Log(req, 'User login.', 'AUTH_SUCCESS');
        log.store();
        req.session.user = user;
        var token = new Token();
        token.init(req, user, function (t) {
          req.session.token = t.title;
          return res.send({token: t.title});
        });
      });
    }
  },
  {
    path: '/logout',
    method: 'GET',
    respond: function (req, res, db) {
      delete req.session.user;
      var token = new Token(req.session.token);
      token.destruct(function (err) {
        delete req.session.token;
        res.redirect('/');
      });
    }
  },
  {
    path: '/register',
    method: 'POST',
    respond: function (req, res, db) {
      if (req.body.username && (req.body.username.length < 2 || req.body.username.length > 16 || req.body.username.search(/^[a-zA-Z0-9\-\_\.]/) < 0)) {
        res.send({err: 'Your username must be 2~16 characters long with only English letters, numbers, "-", "_" and ".".'});
        return;
      }
      if (req.body.password && (req.body.password.length < 6 || req.body.password.length > 20)) {
        res.send({err: 'Your password must be 6~20 charaters long.'});
        return;
      }
      if (req.body.email && (req.body.email.length < 1 || req.body.email.search(/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-zA-z]+/) < 0)) {
        res.send({err: 'Please enter a valid email address.'});
        return;
      }
      req.body.name = req.body.username;
      delete req.body.username;
      var user = new User(req.body, req.body.password);
      user.create(function (err) {
        if (err) {
          res.send(err);
          return;
        }
        var log = new Log(req, 'New user.', 'USER_NEW');
        log.store();
        res.status(201).send();
      });
    }
  }
];

module.exports = shard;