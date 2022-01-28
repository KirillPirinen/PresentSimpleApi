const WebSocket = require('ws');
const {Message, User} = require('../../db/models')

const groups = new Map()

const addMessage = async (user_id, group_id, text) => {
  try {
    await Message.create({user_id, group_id, text})
    return true
  } catch (err) {
    return false
  }
}

const getMessages = async (group_id) => {

  try {
    const messages = await Message.findAll(
      {where:{group_id}, attributes:['id', 'text'], 
        include:{model:User, attributes:['name', 'lname', 'id']}})

    return messages.map(message => (
      {id:message.id, 
        name:`${message.User.name} ${message.User.lname}`, 
        text:message.text, 
        user_id:message.User.id})
    )

  } catch (err) {
    console.log(err)
  }
}

const chatBroadcast = (payload, groupid, self = 0) => {
  groups.get(groupid).forEach((client, id) => {
    if (client.readyState === WebSocket.OPEN && id !== self) {
      client.send(
        JSON.stringify(payload)
      );
    }
  });
}

const chatConnect = (groupid, clientid, client) => {
  if(groups.has(groupid)) {
    groups.get(groupid).set(clientid, client)
  } else {
    groups.set(groupid, new Map([[clientid, client]]))
  }
}

const chatDisconect = (groupid, clientid) => {
  groups.get(groupid).delete(clientid)
}

const currentOnline = (groupid) => {
  return [...groups.get(groupid).keys()]
}

const pingHandler = () => {

  const interval = setInterval(function ping() {
    console.log('ping')
    groups.forEach((group, groupid) => group.forEach((client, clientid) => {
      if (client.isAlive === false) {
        //chatDisconect(groupid, clientid)
        return client.terminate();
      }
  
      client.isAlive = false;
      client.ping();
    }));
  }, 30000);

  return interval;
}

module.exports = {
  chatBroadcast, 
  chatConnect, 
  chatDisconect, 
  currentOnline, 
  getMessages, 
  addMessage,
  pingHandler
};
