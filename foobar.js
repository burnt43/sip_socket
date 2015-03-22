var sip_socket = require('./index.js');
sip_socket.create("200.255.100.116",5060);
sip_socket.on('ready', function () {
  var options_message = 'OPTIONS sip:' + sip_socket.destination_host + ' SIP/2.0\n' +
    'Via: SIP/2.0/UDP ' + sip_socket.source_host + ':' + sip_socket.source_port + ';branch=z9hG4bK26534f84\n' +
    'Max-Forwards: 70\n' +
    'From: "unknown" <sip:unknown@' + sip_socket.source_host + ':' + sip_socket.source_port + '>;tag=ba456efda3\n' +
    'To: <sip:' + sip_socket.destination_host + '>\n' +
    'Contact: <sip:unknown@' + sip_socket.source_host + ':' + sip_socket.source_port + '>\n' +
    'Call-ID: 52094582094832@' + sip_socket.source_host + ':' + sip_socket.source_port + '\n' +
    'CSeq: 102 OPTIONS\n' +
    'User-Agent: James\n' +
    'Accept: text/plain\n' + 
    'Content-Length: 0\n';

  var sip_user_name = "284-eng";

  var register_message = 'REGISTER sip:' + sip_socket.destination_address + ' SIP/2.0\n' +
    'Via: SIP/2.0/UDP ' + sip_socket.source_host + ':' + sip_socket.source_port + ';branch=z9hG4bK26534f84\n' +
    'From: "unknown" <sip:' + sip_user_name + '@' + sip_socket.destination_host + '>;tag=3ceca9d67449aac6o0^\n' +
    'To: "unknown" <sip:' + sip_user_name + '@' + sip_socket.destination_host + '>\n' +
    'Call-ID: da611025-55e45e25@' + sip_socket.source_host + '\n' +
    'CSeq: 60591 REGISTER\n' +
    'Contact: "unknown" <sip:' + sip_user_name + '@' + sip_socket.source_host + '>;expires=300\n' +
    'Authorization: Digest username="' + sip_user_name + '", realm="asterisk", nonce="6fe6b930", uri="sip:' + sip_socket.destination_host + '", response="102cdef93746278a24031cffbcf6618b", algorithm=MD5\n' +
    'Allow: ACK\n' +
    'Allow: BYE\n' +
    'Allow: CANCEL\n' +
    'Allow: INFO\n' +
    'Allow: INVITE\n' +
    'Allow: NOTIFY\n' +
    'Allow: OPTIONS\n' +
    'Allow: REFER\n' +
    'Allow: UPDATE\n' +
    'Max-forwards: 69\n' +
    'User-agent: foobar\n' +
    'Supported: replaces\n' +
    'Content-Length: 0\n';

  sip_socket.on('OK', function(data) {
    console.log(data);
  });

  sip_socket.on('UNKNOWN', function (data) {
    console.log(data);
  });

  //sip_socket.write(options_message);
  sip_socket.write(register_message);
});
