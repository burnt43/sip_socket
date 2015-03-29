var SipClient = require('./sip_client.js');
var sip_client = new SipClient("200.255.100.116","5060","mrfoobar","slapboat");

sip_client.connect();
sip_client.on('connection_established', function () {
  sip_client.register();
});
