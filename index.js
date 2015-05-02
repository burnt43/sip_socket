var SipMessageParser = require('./sip_message_parser.js');

function SipSocket (sip_server_address,sip_server_port) {

  this.sip_server_address = sip_server_address;
  this.sip_server_port    = sip_server_port;

}

SipSocket.prototype.get_sip_server_address  = function () { return this.sip_server_address; }
SipSocket.prototype.get_sip_server_port     = function () { return this.sip_server_port; }
SipSocket.prototype.get_source_address      = function () { return this.source_address; }
SipSocket.prototype.get_source_port         = function () { return this.source_port; }

SipSocket.prototype.connect = function () {
  
  this.socket = require('dgram').createSocket('udp4');
  var self = this;
  this.socket.bind(null, 'localhost', function () {

    self.source_address = self.socket.address().address;
    self.source_port    = self.socket.address().port;
  
    self.socket.on('message', function (data,info) {
      var response_hash = SipMessageParser.parse( data.toString() );
      self.emit(response_hash['MessageType'],response_hash);
    });
    
    self.emit('connection_established');

  });

}

SipSocket.prototype.write = function (string) {
  var message = new Buffer(string);
  var self    = this;

  this.socket.send(message, 0, message.length, this.sip_server_port, this.sip_server_address, function (err) {
    if ( err ) {
      console.log(err);
      self.socket.close();
    }
  });
}

SipSocket.prototype.__proto__ = require('events').EventEmitter.prototype;
module.exports = SipSocket;
