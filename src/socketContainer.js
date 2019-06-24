/**
 * socketContainer
 */
function socketContainer() {
  let sockets = []

  function add(socket) {
    sockets.push(socket)
    
    return sockets.length - 1
  }

  function broadcast(chunk) {
    for (let s in sockets) {
      let socket = sockets[s]

      if (socket.readyState === 1) {
        socket.send(chunk)
      }
    }
  }

  function _read(chunk) {
    broadcast(chunk)
  }

  return {
    add, 
    broadcast, 
    _read
  }
}

module.exports = socketContainer