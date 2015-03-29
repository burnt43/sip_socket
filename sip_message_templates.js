module.exports.options = 'OPTIONS sip:$DESTINATION_ADDRESS SIP/2.0\n' +
  'Via: SIP/2.0/UDP $SOURCE_ADDRESS:$SOURCE_PORT;branch=z9hG4bK26534f84\n' +
  'Max-Forwards: 70\n' +
  'From: "unknown" <sip:unknown@$SOURCE_ADDRESS:$SOURCE_PORT>;tag=ba456efda3\n' +
  'To: <sip:$DESTINATION_ADDRESS>\n' +
  'Contact: <sip:unknown@$SOURCE_ADDRESS:$SOURCE_PORT>\n' +
  'Call-ID: 52094582094832@$SOURCE_ADDRESS:$SOURCE_PORT\n' +
  'CSeq: 102 OPTIONS\n' +
  'User-Agent: James\n' +
  'Accept: text/plain\n' + 
  'Content-Length: 0\n';

module.exports.register = 'REGISTER sip:$DESTINATION_ADDRESS SIP/2.0\n' +
  'Via: SIP/2.0/UDP $SOURCE_ADDRESS:$SOURCE_PORT;branch=z9hG4bK26534f84\n' +
  'From: "unknown" <sip:$SIP_USER_NAME@$DESTINATION_ADDRESS>;tag=3ceca9d67449aac6o0\n' +
  'To: "unknown" <sip:$SIP_USER_NAME@$DESTINATION_ADDRESS>\n' +
  'Call-ID: $SIP_CALLID\n' +
  'CSeq: 60591 REGISTER\n' +
  'Contact: "unknown" <sip:$SIP_USER_NAME@$SOURCE_ADDRESS>;expires=300\n' +
  'Authorization: Digest username="$SIP_USER_NAME", realm="asterisk", nonce="$SIP_NONCE", uri="sip:$DESTINATION_ADDRESS", response="$SIP_RESPONSE", algorithm=MD5\n' +
  'Allow: ACK, BYE, CANCEL, INFO, INVITE, NOTIFY, OPTIONS, REFER, UPDATE\n' +
  'Max-forwards: 69\n' +
  'User-agent: foobar\n' +
  'Supported: replaces\n' +
  'Content-Length: 0\n';
