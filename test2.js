var SipSocket = require('./sip_socket.js');
var sip_socket = new SipSocket ("200.255.100.116","5060");
sip_socket.connect();
sip_socket.on('connection_established', function () {
  function ping () {
    var options_message_prototype = 'OPTIONS sip:$D_ADDRESS SIP/2.0\n' +
      'Via: SIP/2.0/UDP $S_ADDRESS:$S_PORT;branch=z9hG4bK26534f84\n' +
      'Max-Forwards: 70\n' +
      'From: "unknown" <sip:unknown@$S_ADDRESS:$S_PORT>;tag=ba456efda3\n' +
      'To: <sip:$D_ADDRESS>\n' +
      'Contact: <sip:unknown@$S_ADDRESS:$S_PORT>\n' +
      'Call-ID: 52094582094832@$S_ADDRESS:$S_PORT\n' +
      'CSeq: 102 OPTIONS\n' +
      'User-Agent: James\n' +
      'Accept: text/plain\n' + 
      'Content-Length: 0\n';

    var options_message = options_message_prototype.replace(/\$S_ADDRESS/g,sip_socket.get_source_address()).replace(/\$S_PORT/g,sip_socket.get_source_port()).replace(/\$D_ADDRESS/g,sip_socket.get_sip_server_address()).replace(/\$D_PORT/g,sip_socket.get_sip_server_port());
    console.log(options_message);

    sip_socket.on('200', function (data) {
      console.log(data);
    });

    sip_socket.write(options_message);
  }

  function register (user,pass) {

    function random_number () {
      return Math.floor(Math.random() * 10000000).toString(10);
    }

    function md5_hash (input) {
      return crypto.createHash('md5').update(input).digest('hex') + "";
    }

    function generate_nonce () {
      return generate_response().substring(0,8);
    }

    function generate_response (username,nonce,realm,password) {
      if ( !username || !nonce || !realm || !password) {
        return md5_hash( random_number() );
      } else {
        return md5_hash( md5_hash(username + ':' + realm + ':' + password) + ':' + nonce + ':' + md5_hash('REGISTER:sip:'+sip_socket.destination_host) );
      }
    }

    var callid = generate_response() + "@" + sip_socket.source_host;

    function create_register_message (s_address, s_port, d_address, d_port, sip_user_name, password, nonce, response) {
        if ( !nonce ) { nonce = generate_nonce(); }
        if ( !response ) { response = generate_response() }

        return 'REGISTER sip:' + d_address + ' SIP/2.0\n' +
        'Via: SIP/2.0/UDP ' + s_address + ':' + s_port + ';branch=z9hG4bK26534f84\n' +
        'From: "unknown" <sip:' + sip_user_name + '@' + d_address + '>;tag=3ceca9d67449aac6o0\n' +
        'To: "unknown" <sip:' + sip_user_name + '@' + d_address + '>\n' +
        'Call-ID: ' + callid + '\n' +
        'CSeq: 60591 REGISTER\n' +
        'Contact: "unknown" <sip:' + sip_user_name + '@' + s_address + '>;expires=300\n' +
        'Authorization: Digest username="' + sip_user_name + '", realm="asterisk", nonce="' + nonce + '", uri="sip:' + d_address + '", response="' + response + '", algorithm=MD5\n' +
        'Allow: ACK, BYE, CANCEL, INFO, INVITE, NOTIFY, OPTIONS, REFER, UPDATE\n' +
        'Max-forwards: 69\n' +
        'User-agent: foobar\n' +
        'Supported: replaces\n' +
        'Content-Length: 0\n';
    }

    sip_socket.on('401', function (data) {
      console.log(data);
      nonce = data['WWW-Authenticate']['nonce'];
      realm = data['WWW-Authenticate']['realm'];
      response = generate_response(user,nonce,realm,pass);
      sip_socket.write( create_register_message(sip_socket.source_host,sip_socket.source_port,
                                                sip_socket.destination_host,sip_socket.destination_port,
                                                user,pass,nonce,response) );
    });

    sip_socket.on('200', function(data) {
      console.log(data);
    });

    sip_socket.on('403', function(data) {
      console.log(data);
      setTimeout( function () {
        sip_socket.clear();
        register(user,pass);
      }, 5000);
    });

    sip_socket.on('482', function(data) {
      console.log(data);
    });

    sip_socket.write( create_register_message(sip_socket.source_host,sip_socket.source_port,
                                              sip_socket.destination_host,sip_socket.destination_port,
                                              user,pass) );

  }
});

/*
sip_socket.on('ready', function () {


  register("mrfoobar","slapboat");
});
*/
