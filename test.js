var SipSocket = require('./sip_socket.js');
var SipMessageTemplates = require('./sip_message_templates.js');
var sip_socket = new SipSocket ("200.255.100.116","5060");
sip_socket.connect();
sip_socket.on('connection_established', function () {

  function replace_values (string,hash) {

    var replacement_string = string;
    var regex;

    Object.keys(hash).forEach( function (key) {
      regex = new RegExp( '\\$' + key.toUpperCase(), 'g' );
      replacement_string = replacement_string.replace( regex, hash[key] );
    });

    return replacement_string;
  }

  function ping () {

    var options_message = replace_values( SipMessageTemplates.options, {
      'source_address': sip_socket.get_source_address(),
      'source_port': sip_socket.get_source_port(),
      'destination_address': sip_socket.get_sip_server_address(),
      'destination_port': sip_socket.get_sip_server_port()
    });

    sip_socket.on('200', function (data) {
      console.log(data);
    });

    sip_socket.write(options_message);
  }


  function register (user,pass) {

    function random_number () {
      return Math.floor(Math.random() * 10000000).toString(10);
    }

    function md5_sum (input) {
      return require('crypto').createHash('md5').update(input).digest('hex') + "";
    }

    function generate_nonce () {
      return generate_response().substring(0,8);
    }

    function generate_response (username,nonce,realm,password) {
      if ( !username || !nonce || !realm || !password) {
        return md5_sum( random_number() );
      } else {
        return md5_sum( md5_sum(username + ':' + realm + ':' + password) + ':' + nonce + ':' + md5_sum('REGISTER:sip:'+sip_socket.get_sip_server_address()) );
      }
    }

    var callid = generate_response() + "@" + sip_socket.get_source_address();

    function create_register_message (sip_user_name, password, nonce, response) {
        if ( !nonce ) { nonce = generate_nonce(); }
        if ( !response ) { response = generate_response() }


        return replace_values( SipMessageTemplates.register, {
          'source_address': sip_socket.get_source_address(),
          'source_port': sip_socket.get_source_port(),
          'destination_address': sip_socket.get_sip_server_address(),
          'destination_port': sip_socket.get_sip_server_port(),
          'sip_user_name': user,
          'sip_nonce': nonce,
          'sip_response': response,
          'sip_callid': callid
        });
    }

    sip_socket.on('401', function (data) {
      console.log(data);
      nonce = data['WWW-Authenticate']['nonce'];
      realm = data['WWW-Authenticate']['realm'];
      response = generate_response(user,nonce,realm,pass);
      sip_socket.write( create_register_message(user,pass,nonce,response) );
    });

    sip_socket.on('200', function(data) {
      console.log(data);
    });

    sip_socket.on('403', function(data) {
      console.log(data);
    });

    sip_socket.on('482', function(data) {
      console.log(data);
    });

    sip_socket.write( create_register_message(user,pass) );

  }

  register('mrfoobar','slapboat');
});
