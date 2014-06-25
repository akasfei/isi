var shard = {};
var Log = require('../log.js');

shard.routes = [
  {
    path: '/docs',
    method: 'GET',
    respond: function (req, res, db) {
      var log = new Log(req, req.session.user.name + ' listed all documents', 'DOCS_LISTALL');
      log.store();
      db.find({$or: [{author: req.session.user.name}, {share: {$all: [req.session.user.name]}}]}, 'docs', {}, function (err, docs) {
        if (err) console.log(err);
        return res.send({docs: docs});
      });
    }
  },
  {
    path: '/docs/:title',
    method: 'GET',
    respond: function (req, res, db) {
      var log = new Log(req, req.session.user.name + ' retrieved document titled "' + req.params.title + '"', 'DOCS_GET');
      log.store();
      db.find({title: req.params.title}, 'docs', {limit: 1}, function (err, docs) {
        if (err) console.log(err);
        return res.send({doc: docs[0]});
      });
    }
  },
  {
    path: '/docs/:title',
    method: 'PUT',
    respond: function (req, res, db) {
      var log = new Log(req, req.session.user.name + ' created document titled "' + req.params.title + '"', 'DOCS_CREATE');
      log.store();
      var newdoc = {title: req.params.title},{title: req.params.title, content: req.body.content, author: req.session.user.name};
      if (req.body.share)
        newdoc.share = req.body.share.split(',');
      db.update(newdoc, 'docs', {upsert: true}, function (err) {
        if (err) console.log(err);
        return res.send();
      });
    }
  },
  {
    path: '/docs/:title',
    method: 'DELETE',
    respond: function (req, res, db) {
      var log = new Log(req, req.session.user.name + ' deleted document titled "' + req.params.title + '"', 'DOCS_DELETE');
      log.store();
      db.remove({title: req.params.title}, 'docs', {}, function (err) {
        if (err) console.log(err);
        return res.send();
      });
    }
  },
  {
    path: '/users',
    method: 'GET',
    respond: function (req, res, db) {
      db.find({}, 'users', {limit: 10}, function (err, docs){
        if (err) console.log(err);
        var usrs = [];
        for (var i = 0; i < docs.length; i++) {
          usrs.push(docs[i].name);
        }
        return res.send({users: usrs});
      });
    }
  }
].concat(
  require('./ops.js'),
  require('./util.js')
);

module.exports = shard;