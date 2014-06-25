'use strict';

var t = new Date();

for (var i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '-d' && typeof process.argv[i+1] !== 'undefined') {
    process.chdir(process.argv[i+1])
  }
}

var pkg = require('./package.json');

var assert = require('assert');
var async = require('async');
var http = require('http');
var https = require('https');
var fs = require('fs');

var cluster = require('cluster');
var express = require('express');
var redis = require('redis');

var logger = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var connectRedis = require('connect-redis');
var multiparty = require('connect-multiparty');
var errorHandler = require('errorhandler');

var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(session);

var init = require('./lib/init.js');
var view = require('./lib/view.js');
var error = require('./lib/error.js');

var ssl = {
  key: fs.readFileSync('./keys/cas.key'),
  cert: fs.readFileSync('./keys/cas.crt'),
  ca: [{
    key: fs.readFileSync('./keys/ca.key'),
    cert: fs.readFileSync('./keys/ca.crt') 
  }]
};

var server = module.exports = express();

server.locals.version = pkg.version;
if (pkg.production === true) {
  server.set('env', 'production');
  server.locals.production = process.production = true;
} else {
  server.set('env', 'development');
  server.use(logger('dev'));
}
server.use(compress());
server.use(bodyParser());
server.use(multiparty({limit: '8mb'}));
server.use(cookieParser());
server.use(session({store: new RedisStore({client: redisClient}), secret: 'isi'}));
server.use(serveStatic(__dirname + '/static'));
server.use(serveStatic(__dirname + '/casstatic'));
server.use(methodOverride());

server.engine('html', view.__express);
server.set('view engine', 'html');
server.set('views', __dirname + '/views');

server.use(errorHandler({ dumpExceptions: true, showStack: true }));

init('cas', server, function (err) {
  assert.equal(null, err);
  server.use(error.s404);
  server.use(error.s500);
  https.createServer(ssl, server).listen(4443, function(){
    console.log("CAS server booted in %d ms on port 4443.", new Date().getTime() - t.getTime());
  });
});
