var dgram = require('dgram');
var EventEmitter = require('events').EventEmitter;
var string_ops = require('string_ops');
var destination_host, destination_port, socket;
var source_host, source_port;


function parse_sip_response (response) {
  
  function parse_sip_header(line) {
    if ( result = line.match(/^SIP\/2.0\s([0-9]+)/) ) {
      return result[1];
    } else {
      return "UNKNOWN";
    }
  }

  function parse_info (hash_key,info) {
    switch (hash_key) {
      case "WWW-Authenticate":
        var hash = {};
        info.split(',').forEach( function (key_value_pair) {
          var split_pair = key_value_pair.trim().split('=');
          hash[split_pair[0]] = split_pair[1].replace(/['"]/g,"");
        });
        return hash;
        break;
      case "Allow":
        return info.split(',').map( function (allow_string) {
          return allow_string.trim();
        });
        break;
      default:
        return info;
    }
  }

  function parse_sip_line (line) {
    var space = line.indexOf(' ');
    var name = line.substring(0,space);
    var info = line.substring(space+1);

    if ( name.slice(-1) == ':' ) {
      hash_key = name.substring(0,name.length-1)
      response_hash[hash_key] = parse_info(hash_key,info);
    } else if ( name.length > 0 ) {
      response_hash['MessageType'] = parse_sip_header(line);
      response_hash['Header'] = line;
    }
  }

  var response_by_line = response.split('\n');
  var response_hash = {};
  response_by_line.forEach( function (line) {
    parse_sip_line(line.trim());
  });
  module.exports.emit(response_hash['MessageType'],response_hash);
}

module.exports = new EventEmitter();

module.exports.create = function (host,port,source_port) {
  destination_host = host;
  destination_port = port;

  socket = dgram.createSocket('udp4');
  socket.bind(source_port, 'localhost',  function () {
    source_host = socket.address().address;
    source_port = socket.address().port;
    module.exports.destination_host = destination_host;
    module.exports.destination_port = destination_port;
    module.exports.source_host = source_host;
    module.exports.source_port = source_port;
    module.exports.emit('ready');
  });
};

module.exports.write = function (string) {
  var message = new Buffer(string);
  socket.on('message', function (data,info) {
    parse_sip_response(data.toString());
    this.removeListener('message',arguments.callee);
  });
  socket.send(message, 0, message.length, destination_port, destination_host, function (err) {
    if ( err ) {
      console.log(err);
      socket.close();
    }
  });
}

