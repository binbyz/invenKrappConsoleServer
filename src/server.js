#!/usr/local/bin/node

const express           = require('express');
const http              = require('http');
const WebSocket         = require('ws');
const tailStreamWrapper = require('./tailStreamWrapper');
const encrypt           = require('./Encrypt')
const sContainer        = new (require('./socketContainer'));
const commandParser     = new (require('./commandParser'));

const { 
  PATH_NGINX_ACCESS_LOG,
  PATH_NGINX_ERROR_LOG
} = require('./path');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

try {
  // 액세스 로그
  (new tailStreamWrapper('nginx.access', PATH_NGINX_ACCESS_LOG)).pipe(sContainer);

  // 에러 로그
  (new tailStreamWrapper('nginx.error', PATH_NGINX_ERROR_LOG)).pipe(sContainer);
} catch (err) {
  console.error(err);
}

wss.on('connection', (socketClient) => {
  // socketContainer for BroadCasting
  sContainer.add(socketClient);

  // receive message from clients
  socketClient.on('message', (rawMessage) => {
    // send data
    commandParser.parse(rawMessage, (data) => {
      if (socketClient.readyState === 1) {
        socketClient.send(encrypt(JSON.stringify(data)))
      }
    })
  });
});

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} : `);
});