var dgram = require('dgram');
var EventEmitter = require('events').EventEmitter;
var destination_host, destination_port, socket;
var source_host, source_port;
var retransmits = 5;


function parse_sip_response (response) {
  response_hash = {};
  sip_header_found = false;

  function parse_sip_line (line) {
    line = line.substring(0,line.length-1);
    var space = line.indexOf(' ');
    var name = line.substring(0,space);
    var info = line.substring(space+1);

    if ( name.slice(-1) == ':' ) {
      response_hash[name.substring(0,name.length-1)] = info;
    } else if ( name.length > 0 ) {
      response_hash['Header'] = line;
    } else {
      //emit event
    }
  }

  var remaining_string = response;
  while ( remaining_string.length > 0 ) {
    var newline = remaining_string.indexOf('\n');
    var current_string = remaining_string.substring(0,newline);
    remaining_string = remaining_string.substring(newline + 1);
    parse_sip_line(current_string);
  }
  console.log(response_hash);
  return response_hash;
}

module.exports = new EventEmitter();

module.exports.create = function (host,port) {
  destination_host = host;
  destination_port = port;

  socket = dgram.createSocket('udp4');
  socket.bind(null, 'localhost',  function () {
    source_host = socket.address().address;
    source_port = socket.address().port;
    module.exports.emit('ready');
  });
};

function ping_server() {
  var server_response = null;

  var message = new Buffer('OPTIONS sip:' + destination_host + ' SIP/2.0\n' +
    'Via: SIP/2.0/UDP ' + source_host + ':' + source_port + ';branch=z9hG4bK26534f84\n' +
    'Max-Forwards: 70\n' +
    'From: "unknown" <sip:unknown@' + source_host + ':' + source_port + '>;tag=ba456efda3\n' +
    'To: <sip:' + destination_host + '>\n' +
    'Contact: <sip:unknown@' + source_host + ':' + source_port + '>\n' +
    'Call-ID: 52094582094832@' + source_host + ':' + source_port + '\n' +
    'CSeq: 102 OPTIONS\n' +
    'User-Agent: James\n' +
    'Accept: text/plain\n' + 
    'Content-Length: 0\n'
  );
  
  function send_ping() {
    socket.send(message, 0, message.length, destination_port, destination_host, function (err) {});
    setTimeout( function () {
      if ( !server_response ) {
        send_ping();
      } else {
      }
    }, 3000 );
  }

  socket.on('message', function (data,info) {
    hash = parse_sip_response(data.toString());
    server_response = hash['Header'].match(/200 OK/);
  });

  send_ping();

};

module.exports.ping_server = ping_server;
