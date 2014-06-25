var shard = {};
var Log = require('../log.js');

shard.routes = [
  {
    path: '/docs',
    method: 'GET',
    respond: function (req, res, db) {
      var log = new Log(req, 'Lists all documents', 'DOCS_LISTALL');
      log.store();
      db.find({}, 'docs', {}, function (err, docs) {
        if (err) console.log(err);
        return res.send({docs: docs});
      });
    }
  },
  {
    path: '/docs/:title',
    method: 'GET',
    respond: function (req, res, db) {
      var log = new Log(req, 'Retrieve document titled "' + req.params.title + '"', 'DOCS_GET');
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
      var log = new Log(req, 'Create document titled "' + req.params.title + '"', 'DOCS_CREATE');
      log.store();
      db.update({title: req.params.title},{title: req.params.title, content: req.body.content}, 'docs', {upsert: true}, function (err) {
        if (err) console.log(err);
        return res.send();
      });
    }
  },
  {
    path: '/docs/:title',
    method: 'DELETE',
    respond: function (req, res, db) {
      var log = new Log(req, 'Delete document titled "' + req.params.title + '"', 'DOCS_DELETE');
      log.store();
      db.remove({title: req.params.title}, 'docs', {}, function (err) {
        if (err) console.log(err);
        return res.send();
      });
    }
  },
].concat(
  require('./ops.js'),
  require('./util.js')
);

module.exports = shard;