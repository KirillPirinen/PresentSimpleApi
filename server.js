const { createServer } = require('http');
const WebSocket = require('ws');
const {app, sessionParser} = require('./app.js');
const {chatBroadcast, chatConnect, chatDisconect, currentOnline, getMessages, addMessage, pingHandler} = require('./src/functions/broadcast.js');
const urlParser = require('./src/functions/urlparser.js');
const PORT = process.env.SERVER_PORT
const server = createServer(app);

function heartbeat() {
  console.log('pong')
  this.isAlive = true;
}

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

//setupWsHeartbeat(wss)

server.on('upgrade', (request, socket, head) => {

  sessionParser(request, {}, () => {

    if (!request.session.user.id) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    urlParser(request)

    if(!request.group_id) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
    
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', (ws, request) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  const { id, name, lname } = request.session.user;
  const group_id = request.group_id
  
  chatConnect(group_id, id, ws)

  getMessages(group_id)

  chatBroadcast({
    type: 'CHAT_CONNECT',
    payload: id,
    }, group_id, id)

  const online = currentOnline(group_id)
  
  getMessages(group_id).then(messages => {
    ws.send(JSON.stringify({
      type: 'OPEN_CHAT',
      payload: {
        online, 
        messages
      }
    }))
  })
  
  
  ws.on('message', async (message) => {

    const parsed = JSON.parse(message);

    switch (parsed.type) {
      case 'NEW_MESSAGE':
        addMessage(id, group_id, parsed.payload)
        chatBroadcast({
          type: parsed.type,
          payload: { user_id:id, name: `${name} ${lname}`, text: parsed.payload },
        }, group_id)
        break;

      default:
        break;
    }
  });

  const interval = pingHandler()

  ws.on('close', () => {

    chatDisconect(group_id, id)
    
    clearInterval(interval);

    chatBroadcast({
      type: "CHAT_LEAVE",
      payload: id,
    }, group_id, id)

  });
});

server.listen(PORT, () => console.log(`Server has been started ${PORT}`));
