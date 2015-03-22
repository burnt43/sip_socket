var sip_client = require('./index.js');
sip_client.create("200.255.100.116",5060);
sip_client.on('ready', function () {
  sip_client.ping_server();
});
