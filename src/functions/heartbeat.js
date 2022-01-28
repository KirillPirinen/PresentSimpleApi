function setupWsHeartbeat(wss) {
  function noop() {}
  function heartbeat() {
    this.isAlive = true;
  }
   
  wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
  });
   
  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      // client did not respond the ping (pong)
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);
}

module.exports = setupWsHeartbeat;
