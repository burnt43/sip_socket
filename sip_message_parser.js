module.exports.parse = function (response) {
  
  //console.log('------------------------------------------');
  //console.log(response);

  function parse_sip_header(line) {
    if ( result = line.match(/^SIP\/2.0\s([0-9]+)/) ) {
      return result[1];
    } else {
      return 'UNKNOWN';
    }
  }

  function parse_info (hash_key,info) {
    switch (hash_key) {
      case 'Content-Length':
        return parseInt(info);
      case 'WWW-Authenticate':
        var hash = {};
        info.split(',').forEach( function (key_value_pair) {
          var split_pair = key_value_pair.trim().split('=');
          hash[split_pair[0]] = split_pair[1].replace(/['"]/g,'');
        });
        return hash;
        break;
      case 'Allow':
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

  function parse_content ( content_string ) {
    return {};
  }

  var response_hash    = {};
  var remaining_string = response;

  while ( remaining_string.length > 0 ) {
    var index_of_newline = remaining_string.indexOf('\n');
    var current_line     = remaining_string.substring(0,index_of_newline);
    var remaining_string = remaining_string.substring(index_of_newline+1);

    //console.log('current_line(' + current_line.length + ',' + current_line.charCodeAt(0) + ') ' + current_line);
    if ( current_line == '\r' ) {
      response_hash['Content'] = parse_content(remaining_string);
      break;
    } else {
      parse_sip_line(current_line.trim());
    }

  }

  return response_hash;
}
