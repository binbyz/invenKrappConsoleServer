#!/usr/local/bin/node

const { 
  PATH_NGINX_ACCESS_LOG,
  PATH_NGINX_ERROR_LOG
} = require('./path');

const express    = require('express');
const http       = require('http');
const WebSocket  = require('ws');
const atob       = require('atob');
const tfsWrap    = require('./tailStreamWrapper');
const sContainer = new (require('./socketContainer'));
const cmdParser  = new (require('./commandParser'));

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

try {
  (new tfsWrap('nginx.access', PATH_NGINX_ACCESS_LOG)).pipe(sContainer);
  (new tfsWrap('nginx.error', PATH_NGINX_ERROR_LOG)).pipe(sContainer);
} catch (err) {
  console.error(err);
}

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

/**
 * @todo 접근제어
 */
wss.on('connection', (ws) => {
  sContainer.add(ws);

  /**
   * Receive from Clients
   */
  ws.on('message', (recv) => {
    let result = cmdParser.parse(JSON.parse(atob(recv)));
  });
});

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} : `);
});