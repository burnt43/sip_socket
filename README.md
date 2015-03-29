# SIP Socket

### Info
A node.js module for communicating with SIP servers

### Usage
- **require the module**
``` javascript
var SipSocket = require('./sip_socket.js');
```

- **create a new SipSocket**
``` javascript
var sip_socket = new SipSocket ("200.255.100.116","5060");
```

- **call the connect function**
``` javascript
sip_socket.connect();
```

- **wait for the connection_established event before writing**
```javascript
sip_socket.on('connection_established', function () {});
```

- **write a message to the SipSocket**
``` javascript
sip_socket.write(SIP_MESSAGE);
```

- **you can listen for events such as 200 OK**
``` javascript
sip_socket.on('200', function (data) {
  console.log(data);
});
```

- **data is a hash of the sip message data**
``` javascript
{ MessageType: '200',
  Header: 'SIP/2.0 200 OK',
  Via: 'SIP/2.0/UDP 127.0.0.1:36467;branch=z9hG4bK26534f84;received=127.0.0.1',
  From: '"unknown" <sip:mrfoobar@200.255.100.116>;tag=3ceca9d67449aac6o0',
  To: '"unknown" <sip:mrfoobar@200.255.100.116>;tag=as5a8e16ed',
  'Call-ID': '51f75211ce1851df7e7d509ab7932e49@127.0.0.1',
  CSeq: '60591 REGISTER',
  Server: 'Asterisk PBX SVN--r',
  Allow: 
   [ 'INVITE',
     'ACK',
     'CANCEL',
     'OPTIONS',
     'BYE',
     'REFER',
     'SUBSCRIBE',
     'NOTIFY',
     'INFO',
     'PUBLISH' ],
  Supported: 'replaces',
  Expires: '300',
  Contact: '<sip:mrfoobar@127.0.0.1>;expires=300',
  Date: 'Sun, 29 Mar 2015 02:34:01 GMT',
  'Content-Length': '0' }
```
