var Token = require('./token.js');

var cbpage = 'Session Engaged...<script>window.location.href="/"</script>'; // TODO: callback page

module.exports = function (req, res, next) {
  if (req.originalUrl.search(/cascallback/) >= 0) {
    res.cookie('isitoken', req.query.settoken, {maxAge: 1 * 60 * 60 * 1000});
    res.send(cbpage);
  } else if (req.cookies.isitoken) {
    // validate token
    var token = new Token(req.cookies.isitoken);
    token.validate(req, function (verdict) {
      if (verdict) {
        req.session.user = token.user;
        next();
      }
      else res.redirect('https://cas.isitest.org:4443/#invalid-token');
    });
  } else
    res.redirect('https://cas.isitest.org:4443');
}