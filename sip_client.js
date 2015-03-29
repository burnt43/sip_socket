var SipSocket           = require('./sip_socket.js');
var SipMessageTemplates = require('./sip_message_templates.js');
var SipClientHelper     = require('./sip_client_helper.js');

function SipClient (sip_server_address,sip_server_port,username,password) {

  this.sip_server_address = sip_server_address;
  this.sip_server_port    = sip_server_port;
  this.username           = username;
  this.password           = password;
  this.sip_socket         = new SipSocket(this.sip_server_address,this.sip_server_port);

}

SipClient.prototype.connect = function () {

  this.sip_socket.connect();
  var self = this;
  this.sip_socket.on('connection_established', function () {
    self.emit('connection_established');
  });
    
}

SipClient.prototype.create_callid = function () { return this.generate_response() + '@' + this.sip_socket.get_source_address(); }
SipClient.prototype.generate_nonce = function () { return this.generate_response().substring(0,8); }

SipClient.prototype.generate_response = function (nonce,realm) {
  if ( !nonce || !realm ) {
    return SipClientHelper.md5_sum( SipClientHelper.random_number() );
  } else {
    return SipClientHelper.md5_sum( SipClientHelper.md5_sum(this.username + ':' + realm + ':' + this.password) + ':' + nonce + ':' + SipClientHelper.md5_sum('REGISTER:sip:'+this.sip_socket.get_sip_server_address()) );
  }
}

SipClient.prototype.ping_server = function () {

  var callid = this.create_callid();
  var options_message = SipClientHelper.replace_values( SipMessageTemplates.options, {
    'source_address': this.sip_socket.get_source_address(),
    'source_port': this.sip_socket.get_source_port(),
    'destination_address': this.sip_socket.get_sip_server_address(),
    'destination_port': this.sip_socket.get_sip_server_port(),
    'sip_callid': callid
  });

  this.sip_socket.write(options_message);

  this.sip_socket.on('200', function (data) {
    console.log(data);
  });

}

SipClient.prototype.register = function () {

  var callid = this.create_callid();
  var self = this;

  function create_register_message (nonce, response) {
      if ( !nonce ) { nonce = self.generate_nonce(); }
      if ( !response ) { response = self.generate_response() }

      return SipClientHelper.replace_values( SipMessageTemplates.register, {
        'source_address': self.sip_socket.get_source_address(),
        'source_port': self.sip_socket.get_source_port(),
        'destination_address': self.sip_socket.get_sip_server_address(),
        'destination_port': self.sip_socket.get_sip_server_port(),
        'sip_user_name': self.username,
        'sip_nonce': nonce,
        'sip_response': response,
        'sip_callid': callid
      });
  }

  this.sip_socket.on('401', function (data) {
    console.log(data);
    var nonce = data['WWW-Authenticate']['nonce'];
    var realm = data['WWW-Authenticate']['realm'];
    response = self.generate_response(nonce,realm);
    self.sip_socket.write( create_register_message(nonce,response) );
  });

  this.sip_socket.on('200', function (data) {
    console.log(data);
  });

  this.sip_socket.on('403', function (data) {
    console.log(data);
  });

  this. sip_socket.on('482', function (data) {
    console.log(data);
  });

  this.sip_socket.write( create_register_message() );

}

SipClient.prototype.__proto__ = require('events').EventEmitter.prototype;
module.exports = SipClient;
