var express = require('express');
var router = express.Router();
var ouath = require ('oauth-sign')
var timestamp = Math.round(Date.now() / 1000);

/* GET users listing. */
router.get('/', function(req, res, next) {debugger
  res.send('respond with a resource');

  var LTIparams = {
    lti_message_type: req.query.lti_message_type,
    lti_version: req.query.lti_version,
    resource_link_id: req.query.resource_link_id,
    resource_link_title: req.query.resource_link_title,
    // OAuth 1.0 params
    oauth_consumer_key: req.query.oauth_consumer_key,
    oauth_nonce: req.query.oauth_nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_version: '1.0',
    
  }
  var oauth_signature_method = ouath.hmacsign(LTIparams.oauth_signature_method, 'POST', LTIparams, req.query.tool_secret);
  console.log(oauth_signature_method)
});

router.post('/', function(req, res, next) {
  res.send('respond with a resource1');
});

module.exports = router;
