function socketContainer() {
  let o       = {}
    , sockets = [];

  o.add = (socket) => {
    sockets.push(socket);
  };

  o.broadcast = (chunk) => {
    for (let s in sockets) {
      let socket = sockets[s];

      if (socket.readyState === 1) {
        socket.send(chunk.toString());
      }
    }
  };

  o._read = (chunk) => {
    o.broadcast(chunk);
  };

  return o;
}

module.exports = socketContainer;