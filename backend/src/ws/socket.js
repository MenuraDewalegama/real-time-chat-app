const jwt = require("jsonwebtoken");
const Message = require("../models/Message"); 
const { pub, sub } = require("../redis");     

const sockets = new Map();


function broadcastUsers(wss) {
  const onlineUsers = Array.from(sockets.keys());

  wss.clients.forEach(client => {
    if (client.readyState !== 1 || !client.user) return;

    client.send(JSON.stringify({
      type: "users",
      users: onlineUsers.filter(u => u !== client.user)
    }));
  });
}

function initWS(wss) {
  sub.subscribe("chat:public");
  sub.subscribe("chat:dm");

  sub.on("message", (channel, message) => {
    const data = JSON.parse(message);

    if (channel === "chat:public") {
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
    }

    if (channel === "chat:dm") {
      const receiverSocket = sockets.get(data.to);
      if (receiverSocket && receiverSocket.readyState === 1) {
        receiverSocket.send(JSON.stringify(data));
      }

      const senderSocket = sockets.get(data.from);
      if (senderSocket && senderSocket.readyState === 1) {
        senderSocket.send(JSON.stringify(data));
      }
    }
  });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (raw) => {
      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        return;
      }

      if (data.type === "auth") {
        try {
          const user = jwt.verify(data.token, process.env.JWT_SECRET);

          ws.user = user.username;
          sockets.set(ws.user, ws);

          ws.send(JSON.stringify({
            type: "system",
            message: "authenticated"
          }));

          console.log("User online:", ws.user);

          broadcastUsers(wss);

        } catch {
          ws.send(JSON.stringify({
            type: "error",
            message: "unauthorized"
          }));
        }

        return;
      }

      // PUBLIC MESSAGE
      if (data.type === "message") {
        if (!ws.user) return;

        await Message.create({
          from: ws.user,
          to: null,
          text: data.text,
          time: new Date()
        });

        pub.publish("chat:public", JSON.stringify({
          type: "message",
          from: ws.user,
          text: data.text,
          time: new Date()
        }));

        return;
      }

      // PRIVATE DM
      if (data.type === "dm") {
        if (!ws.user) return;

        await Message.create({
          from: ws.user,
          to: data.to,
          text: data.text,
          time: new Date()
        });

        pub.publish("chat:dm", JSON.stringify({
          type: "dm",
          from: ws.user,
          to: data.to,
          text: data.text,
          time: new Date()
        }));

        return;
      }
    });

    ws.on("close", () => {
      if (ws.user) {
        sockets.delete(ws.user);
        console.log("User offline:", ws.user);

        broadcastUsers(wss);
      }
    });
  });
}

module.exports = initWS;