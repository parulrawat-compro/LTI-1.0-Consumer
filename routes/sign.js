var express = require('express');
var router = express.Router();
var ouath = require ('oauth-sign');
var crypto = require('crypto');
var timestamp = Math.round(Date.now() / 1000);


router.get('/', function(req, res) {

  var LTIParams = {
    
    //REQUIRED
    lti_message_type: req.query.lti_message_type, 
    lti_version: req.query.lti_version,
    resource_link_id: req.query.resource_link_id,

    //RECOMMENDED
    context_id: req.query.context_id,
    resource_link_title: req.query.resource_link_title,
    
    // OAuth 1.0 params
    oauth_consumer_key: req.query.oauth_consumer_key,
    oauth_signature_method: req.query.oauth_signature_method,
    oauth_timestamp: timestamp, 
    oauth_nonce: timestamp+crypto.randomBytes(32).toString('base64'),
    oauth_version: req.query.oauth_version
  }

  var obj = {
    tool_provider_url: req.query.tool_consumer_instance_url,
    tool_secret: req.query.tool_secret
  }

  //delete tool url, secret
  delete req.query.tool_consumer_instance_url;
  delete req.query.tool_secret;

  try {

    //SIGN
    LTIParams.oauth_signature = ouath.hmacsign('POST', obj.tool_provider_url, LTIParams, obj.tool_secret);
    console.log(LTIParams)
    res.render('sign.jade', {
      title: 'ChemVintage',
      LTIParams: LTIParams,
      action: obj.tool_provider_url,
      method: 'POST'
    });
  } catch (e) {
    console.log(e.message);
  }

});

module.exports = router;
