var express = require('express');
const request = require('request')
var router = express.Router();
var ouath = require ('oauth-sign');
var crypto = require('crypto');
var timestamp = Math.round(Date.now() / 1000);

/* GET users listing. */
router.get('/', function(req, res, next) {

  var LTIParams = {

    //REQUIRED
    lti_message_type: req.query.lti_message_type,
    lti_version: req.query.lti_version,
    resource_link_id: req.query.resource_link_id,

    //RECOMMENDED
    context_id: req.query.context_id,
    tool_provider_url: req.query.tool_consumer_instance_url,
    resource_link_title: req.query.resource_link_title,
    
    // OAuth 1.0 params
    oauth_consumer_key: req.query.oauth_consumer_key,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp, 
    oauth_nonce: timestamp+crypto.randomBytes(32).toString('base64'),
    oauth_version: '1.0'
  }

  try {
    
    //SIGN
    LTIParams.oauth_signature = ouath.hmacsign('POST', LTIParams.tool_provider_url, LTIParams, req.query.tool_secret);

    res.render('verify.jade', {
      title: 'ChemVintage',
      LTIParams: LTIParams,
      action: LTIParams.tool_provider_url,
      method: 'POST'
    });
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
