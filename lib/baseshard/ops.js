var util = require('util');

var Log = require('../log.js');

module.exports = [
  {
    path: '/logs',
    method: 'GET',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.name !== 'root') {
        return res.status(403).send({err: 'Forbidden.'});
      }
      var query = {};
      var opt = {limit: 20, sort: {_id: -1}};
      if (typeof req.query !== 'undefined') {
        if (typeof req.query.q !== 'undefined')
          query.tag = req.query.q;
        if (typeof req.query.l !== 'undefined')
          opt.limit = req.query.l;
      }
      db.find(query, 'logs', opt, function (err, docs) {
        if (err)
          return console.log('Error retrieving logs: ' + util.inspect(err));
        res.send({logs: docs});
      });
    }
  },
  {
    path: '/logs',
    method: 'PUT',
    respond: function (req, res, db) {
      var log = new Log(req, req.body.msg, req.body.tag);
      log.store();
    }
  }
]