var sip_socket = require('./index.js');
sip_socket.create("200.255.100.116",5060);
sip_socket.on('ready', function () {
  var message = 'OPTIONS sip:' + sip_socket.destination_host + ' SIP/2.0\n' +
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

  sip_socket.on('OK', function(data) {
    console.log(data);
  });

  sip_socket.write(message);
});
