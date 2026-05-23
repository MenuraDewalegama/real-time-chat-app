// // const jwt = require("jsonwebtoken");
// // const Message = require("../models/Message");

// // // function botReply(text) {
// // //   if (text.includes("hello")) return "Hi 👋 I'm bot";
// // //   if (text.includes("help")) return "Try typing anything!";
// // //   return "Bot: " + text;
// // // }

// // function broadcast(wss, data) {
// //     wss.clients.forEach((client) => {
// //         if (client.readyState === 1) {
// //             client.send(JSON.stringify(data));
// //         }
// //     });
// // }

// // function initWS(wss) {
// //     wss.on("connection", (ws) => {
// //         console.log("WS client connected");

// //         ws.on("message", async (raw) => {
// //             let data;

// //             try {
// //                 data = JSON.parse(raw);
// //             } catch {
// //                 return;
// //             }

// //             // AUTH
// //             if (data.type === "auth") {
// //                 try {
// //                     const user = jwt.verify(data.token, process.env.JWT_SECRET);
// //                     ws.user = user.username;

// //                     ws.send(JSON.stringify({
// //                         type: "system",
// //                         message: "authenticated"
// //                     }));
// //                 } catch {
// //                     ws.send(JSON.stringify({
// //                         type: "error",
// //                         message: "unauthorized"
// //                     }));
// //                 }
// //                 return;
// //             }

// //             // CHAT
// //             if (data.type === "message") {
// //                 if (!ws.user) return;

// //                 const msg = await Message.create({
// //                     user: ws.user,
// //                     text: data.text,
// //                     time: new Date()
// //                 });

// //                 broadcast(wss, {
// //                     type: "message",
// //                     user: msg.user,
// //                     text: msg.text,
// //                     time: msg.time
// //                 });

// //                 // BOT reply
// //                 // setTimeout(() => {
// //                 //   broadcast(wss, {
// //                 //     type: "message",
// //                 //     user: "Bot",
// //                 //     text: botReply(data.text.toLowerCase()),
// //                 //     time: new Date()
// //                 //   });
// //                 // }, 400);
// //             }
// //         });

// //         ws.on("close", () => {
// //             console.log("Client disconnected:", ws.user || "unknown");
// //         });
// //     });
// // }

// // module.exports = initWS;



// // const jwt = require("jsonwebtoken");
// // const Message = require("../models/Message");

// // // 👥 Online users: username → ws connection
// // const users = new Map();

// // /**
// //  * 📡 Send online users list to everyone
// //  */
// // function broadcastUsers(wss) {
// //     const onlineUsers = Array.from(users.keys());

// //     const payload = JSON.stringify({
// //         type: "users",
// //         users: onlineUsers
// //     });

// //     wss.clients.forEach((client) => {
// //         if (client.readyState === 1) {
// //             client.send(payload);
// //         }
// //     });
// // }

// // /**
// //  * 📢 Broadcast message to all users
// //  */
// // function broadcast(wss, data) {
// //     wss.clients.forEach((client) => {
// //         if (client.readyState === 1) {
// //             client.send(JSON.stringify(data));
// //         }
// //     });
// // }

// // function initWS(wss) {
// //     wss.on("connection", (ws) => {
// //         console.log("Client connected");

// //         ws.on("message", async (raw) => {
// //             let data;

// //             try {
// //                 data = JSON.parse(raw);
// //             } catch {
// //                 return;
// //             }

// //             // =========================
// //             // 🔐 AUTH
// //             // =========================
// //             if (data.type === "auth") {
// //                 try {
// //                     const user = jwt.verify(
// //                         data.token,
// //                         process.env.JWT_SECRET
// //                     );

// //                     ws.user = user.username;

// //                     // store connection
// //                     users.set(ws.user, ws);

// //                     ws.send(JSON.stringify({
// //                         type: "system",
// //                         message: "authenticated"
// //                     }));

// //                     console.log("User online:", ws.user);

// //                     // 👥 update user list
// //                     broadcastUsers(wss);

// //                 } catch {
// //                     ws.send(JSON.stringify({
// //                         type: "error",
// //                         message: "unauthorized"
// //                     }));
// //                 }
// //                 return;
// //             }

// //             // =========================
// //             // 📢 PUBLIC CHAT
// //             // =========================
// //             if (data.type === "message") {
// //                 if (!ws.user) return;

// //                 const msg = await Message.create({
// //                     from: ws.user,
// //                     to: null,
// //                     text: data.text,
// //                     time: new Date()
// //                 });

// //                 broadcast(wss, {
// //                     type: "message",
// //                     from: msg.from,
// //                     text: msg.text,
// //                     time: msg.time
// //                 });

// //                 return;
// //             }

// //             // =========================
// //             // 💬 PRIVATE DM
// //             // =========================
// //             if (data.type === "dm") {
// //                 if (!ws.user) return;

// //                 const receiverWS = users.get(data.to);

// //                 const msg = await Message.create({
// //                     from: ws.user,
// //                     to: data.to,
// //                     text: data.text,
// //                     time: new Date()
// //                 });

// //                 const payload = {
// //                     type: "dm",
// //                     from: ws.user,
// //                     to: data.to,
// //                     text: data.text,
// //                     time: msg.time
// //                 };

// //                 // send to receiver
// //                 if (receiverWS) {
// //                     receiverWS.send(JSON.stringify(payload));
// //                 }

// //                 // send to sender
// //                 ws.send(JSON.stringify(payload));

// //                 return;
// //             }
// //         });

// //         // =========================
// //         // 🚪 DISCONNECT
// //         // =========================
// //         ws.on("close", () => {
// //             if (ws.user) {
// //                 users.delete(ws.user);
// //                 console.log("User offline:", ws.user);
// //             }

// //             // 👥 update everyone
// //             broadcastUsers(wss);
// //         });
// //     });
// // }

// // module.exports = initWS;


// //works perfectly------------------------------------------------------------------------

// // const jwt = require("jsonwebtoken");
// // const Message = require("../models/Message");

// // // 👥 online users: username → ws
// // const users = new Map();

// // /**
// //  * 📢 Send personalized online users list
// //  */
// // function broadcastUsers(wss) {
// //   wss.clients.forEach(client => {
// //     if (client.readyState !== 1) return;

// //     const currentUser = client.user;

// //     const onlineUsers = Array.from(users.keys())
// //       .filter(username => username !== currentUser); // 🚫 remove self

// //     client.send(JSON.stringify({
// //       type: "users",
// //       users: onlineUsers
// //     }));
// //   });
// // }

// // /**
// //  * 📢 broadcast message to all clients
// //  */
// // function broadcast(wss, data) {
// //   wss.clients.forEach(client => {
// //     if (client.readyState === 1) {
// //       client.send(JSON.stringify(data));
// //     }
// //   });
// // }

// // function initWS(wss) {
// //   wss.on("connection", (ws) => {
// //     console.log("Client connected");

// //     ws.on("message", async (raw) => {
// //       let data;

// //       try {
// //         data = JSON.parse(raw);
// //       } catch {
// //         return;
// //       }

// //       // =========================
// //       // 🔐 AUTH
// //       // =========================
// //       if (data.type === "auth") {
// //         try {
// //           const user = jwt.verify(data.token, process.env.JWT_SECRET);

// //           ws.user = user.username;

// //           // store user
// //           users.set(ws.user, ws);

// //           ws.send(JSON.stringify({
// //             type: "system",
// //             message: "authenticated"
// //           }));

// //           console.log("User online:", ws.user);

// //           // 👥 update user lists
// //           broadcastUsers(wss);

// //         } catch {
// //           ws.send(JSON.stringify({
// //             type: "error",
// //             message: "unauthorized"
// //           }));
// //         }
// //         return;
// //       }

// //       // =========================
// //       // 📢 PUBLIC CHAT
// //       // =========================
// //       if (data.type === "message") {
// //         if (!ws.user) return;

// //         const msg = await Message.create({
// //           from: ws.user,
// //           to: null,
// //           text: data.text,
// //           time: new Date()
// //         });

// //         broadcast(wss, {
// //           type: "message",
// //           from: msg.from,
// //           text: msg.text,
// //           time: msg.time
// //         });

// //         return;
// //       }

// //       // =========================
// //       // 💬 PRIVATE DM
// //       // =========================
// //       if (data.type === "dm") {
// //         if (!ws.user) return;

// //         const receiverWS = users.get(data.to);

// //         const msg = await Message.create({
// //           from: ws.user,
// //           to: data.to,
// //           text: data.text,
// //           time: new Date()
// //         });

// //         const payload = {
// //           type: "dm",
// //           from: ws.user,
// //           to: data.to,
// //           text: data.text,
// //           time: msg.time
// //         };

// //         // send to receiver
// //         if (receiverWS) {
// //           receiverWS.send(JSON.stringify(payload));
// //         }

// //         // send back to sender
// //         ws.send(JSON.stringify(payload));

// //         return;
// //       }
// //     });

// //     // =========================
// //     // 🚪 DISCONNECT
// //     // =========================
// //     ws.on("close", () => {
// //       if (ws.user) {
// //         users.delete(ws.user);
// //         console.log("User offline:", ws.user);
// //       }

// //       broadcastUsers(wss);
// //     });
// //   });
// // }

// // module.exports = initWS;
















// // // ---
// // const jwt = require("jsonwebtoken");
// // const Message = require("./models/Message");
// // const { pub, sub } = require("./redis");

// // // 🧠 only local socket references (NOT for scaling logic)
// // const sockets = new Map();

// // function initWS(wss) {

// //   // =========================
// //   // 📡 REDIS SUBSCRIPTIONS
// //   // =========================
// //   sub.subscribe("chat:public");
// //   sub.subscribe("chat:dm");

// //   sub.on("message", (channel, message) => {
// //     const data = JSON.parse(message);

// //     // =========================
// //     // 📢 PUBLIC BROADCAST
// //     // =========================
// //     if (channel === "chat:public") {
// //       wss.clients.forEach(client => {
// //         if (client.readyState === 1) {
// //           client.send(JSON.stringify(data));
// //         }
// //       });
// //     }

// //     // =========================
// //     // 💬 PRIVATE DM DELIVERY
// //     // =========================
// //     if (channel === "chat:dm") {
// //       const receiverSocket = sockets.get(data.to);

// //       if (receiverSocket && receiverSocket.readyState === 1) {
// //         receiverSocket.send(JSON.stringify(data));
// //       }
// //     }
// //   });

// //   // =========================
// //   // 🔌 CONNECTION HANDLER
// //   // =========================
// //   wss.on("connection", (ws) => {

// //     console.log("Client connected");

// //     // =========================
// //     // 📩 MESSAGE HANDLER
// //     // =========================
// //     ws.on("message", async (raw) => {
// //       let data;

// //       try {
// //         data = JSON.parse(raw);
// //       } catch {
// //         return;
// //       }

// //       // =========================
// //       // 🔐 AUTH
// //       // =========================
// //       if (data.type === "auth") {
// //         try {
// //           const user = jwt.verify(data.token, process.env.JWT_SECRET);

// //           ws.user = user.username;

// //           sockets.set(ws.user, ws);

// //           ws.send(JSON.stringify({
// //             type: "system",
// //             message: "authenticated"
// //           }));

// //           console.log("User online:", ws.user);

// //         } catch {
// //           ws.send(JSON.stringify({
// //             type: "error",
// //             message: "unauthorized"
// //           }));
// //         }

// //         return;
// //       }

// //       // =========================
// //       // 📢 PUBLIC MESSAGE (REDIS)
// //       // =========================
// //       if (data.type === "message") {
// //         if (!ws.user) return;

// //         const msg = {
// //           type: "message",
// //           from: ws.user,
// //           text: data.text,
// //           time: new Date()
// //         };

// //         await Message.create({
// //           from: ws.user,
// //           to: null,
// //           text: data.text,
// //           time: new Date()
// //         });

// //         // 🚀 broadcast via redis (cross-pod)
// //         pub.publish("chat:public", JSON.stringify(msg));

// //         return;
// //       }

// //       // =========================
// //       // 💬 PRIVATE DM (REDIS)
// //       // =========================
// //       if (data.type === "dm") {
// //         if (!ws.user) return;

// //         const msg = {
// //           type: "dm",
// //           from: ws.user,
// //           to: data.to,
// //           text: data.text,
// //           time: new Date()
// //         };

// //         await Message.create({
// //           from: ws.user,
// //           to: data.to,
// //           text: data.text,
// //           time: new Date()
// //         });

// //         // 🚀 send via redis pub/sub
// //         pub.publish("chat:dm", JSON.stringify(msg));

// //         return;
// //       }
// //     });

// //     // =========================
// //     // 🚪 DISCONNECT CLEANUP
// //     // =========================
// //     ws.on("close", () => {
// //       if (ws.user) {
// //         sockets.delete(ws.user);
// //         console.log("User offline:", ws.user);
// //       }
// //     });
// //   });
// // }

// // module.exports = initWS;




// const jwt = require("jsonwebtoken");
// const Message = require("../models/Message"); // ✅ FIX 5: correct path (was "./models/Message")
// const { pub, sub } = require("../redis");     // ✅ FIX 5: correct path (was "./redis")

// // Local socket references for this pod only
// const sockets = new Map();

// // ✅ FIX 6: broadcastUsers — sends online list to every connected user,
// // excluding themselves from their own list
// function broadcastUsers(wss) {
//   const onlineUsers = Array.from(sockets.keys());

//   wss.clients.forEach(client => {
//     if (client.readyState !== 1 || !client.user) return;

//     client.send(JSON.stringify({
//       type: "users",
//       users: onlineUsers.filter(u => u !== client.user)
//     }));
//   });
// }

// function initWS(wss) {

//   // Redis subscriptions — receives messages published by any pod
//   sub.subscribe("chat:public");
//   sub.subscribe("chat:dm");

//   sub.on("message", (channel, message) => {
//     const data = JSON.parse(message);

//     if (channel === "chat:public") {
//       wss.clients.forEach(client => {
//         if (client.readyState === 1) {
//           client.send(JSON.stringify(data));
//         }
//       });
//     }

//     if (channel === "chat:dm") {
//       const receiverSocket = sockets.get(data.to);
//       if (receiverSocket && receiverSocket.readyState === 1) {
//         receiverSocket.send(JSON.stringify(data));
//       }
//     }
//   });

//   wss.on("connection", (ws) => {
//     console.log("Client connected");

//     ws.on("message", async (raw) => {
//       let data;

//       try {
//         data = JSON.parse(raw);
//       } catch {
//         return;
//       }

//       // AUTH
//       if (data.type === "auth") {
//         try {
//           const user = jwt.verify(data.token, process.env.JWT_SECRET);

//           ws.user = user.username;
//           sockets.set(ws.user, ws);

//           ws.send(JSON.stringify({
//             type: "system",
//             message: "authenticated"
//           }));

//           console.log("User online:", ws.user);

//           // ✅ FIX 6: Broadcast updated user list after someone connects
//           broadcastUsers(wss);

//         } catch {
//           ws.send(JSON.stringify({
//             type: "error",
//             message: "unauthorized"
//           }));
//         }

//         return;
//       }

//       // PUBLIC MESSAGE
//       if (data.type === "message") {
//         if (!ws.user) return;

//         await Message.create({
//           from: ws.user,
//           to: null,
//           text: data.text,
//           time: new Date()
//         });

//         pub.publish("chat:public", JSON.stringify({
//           type: "message",
//           from: ws.user,
//           text: data.text,
//           time: new Date()
//         }));

//         return;
//       }

//       // PRIVATE DM
//       if (data.type === "dm") {
//         if (!ws.user) return;

//         await Message.create({
//           from: ws.user,
//           to: data.to,
//           text: data.text,
//           time: new Date()
//         });

//         pub.publish("chat:dm", JSON.stringify({
//           type: "dm",
//           from: ws.user,
//           to: data.to,
//           text: data.text,
//           time: new Date()
//         }));

//         return;
//       }
//     });

//     ws.on("close", () => {
//       if (ws.user) {
//         sockets.delete(ws.user);
//         console.log("User offline:", ws.user);

//         // ✅ FIX 6: Broadcast updated user list after someone disconnects
//         broadcastUsers(wss);
//       }
//     });
//   });
// }

// module.exports = initWS;







// const jwt = require("jsonwebtoken");
// const Message = require("../models/Message");

// // function botReply(text) {
// //   if (text.includes("hello")) return "Hi 👋 I'm bot";
// //   if (text.includes("help")) return "Try typing anything!";
// //   return "Bot: " + text;
// // }

// function broadcast(wss, data) {
//     wss.clients.forEach((client) => {
//         if (client.readyState === 1) {
//             client.send(JSON.stringify(data));
//         }
//     });
// }

// function initWS(wss) {
//     wss.on("connection", (ws) => {
//         console.log("WS client connected");

//         ws.on("message", async (raw) => {
//             let data;

//             try {
//                 data = JSON.parse(raw);
//             } catch {
//                 return;
//             }

//             // AUTH
//             if (data.type === "auth") {
//                 try {
//                     const user = jwt.verify(data.token, process.env.JWT_SECRET);
//                     ws.user = user.username;

//                     ws.send(JSON.stringify({
//                         type: "system",
//                         message: "authenticated"
//                     }));
//                 } catch {
//                     ws.send(JSON.stringify({
//                         type: "error",
//                         message: "unauthorized"
//                     }));
//                 }
//                 return;
//             }

//             // CHAT
//             if (data.type === "message") {
//                 if (!ws.user) return;

//                 const msg = await Message.create({
//                     user: ws.user,
//                     text: data.text,
//                     time: new Date()
//                 });

//                 broadcast(wss, {
//                     type: "message",
//                     user: msg.user,
//                     text: msg.text,
//                     time: msg.time
//                 });

//                 // BOT reply
//                 // setTimeout(() => {
//                 //   broadcast(wss, {
//                 //     type: "message",
//                 //     user: "Bot",
//                 //     text: botReply(data.text.toLowerCase()),
//                 //     time: new Date()
//                 //   });
//                 // }, 400);
//             }
//         });

//         ws.on("close", () => {
//             console.log("Client disconnected:", ws.user || "unknown");
//         });
//     });
// }

// module.exports = initWS;



// const jwt = require("jsonwebtoken");
// const Message = require("../models/Message");

// // 👥 Online users: username → ws connection
// const users = new Map();

// /**
//  * 📡 Send online users list to everyone
//  */
// function broadcastUsers(wss) {
//     const onlineUsers = Array.from(users.keys());

//     const payload = JSON.stringify({
//         type: "users",
//         users: onlineUsers
//     });

//     wss.clients.forEach((client) => {
//         if (client.readyState === 1) {
//             client.send(payload);
//         }
//     });
// }

// /**
//  * 📢 Broadcast message to all users
//  */
// function broadcast(wss, data) {
//     wss.clients.forEach((client) => {
//         if (client.readyState === 1) {
//             client.send(JSON.stringify(data));
//         }
//     });
// }

// function initWS(wss) {
//     wss.on("connection", (ws) => {
//         console.log("Client connected");

//         ws.on("message", async (raw) => {
//             let data;

//             try {
//                 data = JSON.parse(raw);
//             } catch {
//                 return;
//             }

//             // =========================
//             // 🔐 AUTH
//             // =========================
//             if (data.type === "auth") {
//                 try {
//                     const user = jwt.verify(
//                         data.token,
//                         process.env.JWT_SECRET
//                     );

//                     ws.user = user.username;

//                     // store connection
//                     users.set(ws.user, ws);

//                     ws.send(JSON.stringify({
//                         type: "system",
//                         message: "authenticated"
//                     }));

//                     console.log("User online:", ws.user);

//                     // 👥 update user list
//                     broadcastUsers(wss);

//                 } catch {
//                     ws.send(JSON.stringify({
//                         type: "error",
//                         message: "unauthorized"
//                     }));
//                 }
//                 return;
//             }

//             // =========================
//             // 📢 PUBLIC CHAT
//             // =========================
//             if (data.type === "message") {
//                 if (!ws.user) return;

//                 const msg = await Message.create({
//                     from: ws.user,
//                     to: null,
//                     text: data.text,
//                     time: new Date()
//                 });

//                 broadcast(wss, {
//                     type: "message",
//                     from: msg.from,
//                     text: msg.text,
//                     time: msg.time
//                 });

//                 return;
//             }

//             // =========================
//             // 💬 PRIVATE DM
//             // =========================
//             if (data.type === "dm") {
//                 if (!ws.user) return;

//                 const receiverWS = users.get(data.to);

//                 const msg = await Message.create({
//                     from: ws.user,
//                     to: data.to,
//                     text: data.text,
//                     time: new Date()
//                 });

//                 const payload = {
//                     type: "dm",
//                     from: ws.user,
//                     to: data.to,
//                     text: data.text,
//                     time: msg.time
//                 };

//                 // send to receiver
//                 if (receiverWS) {
//                     receiverWS.send(JSON.stringify(payload));
//                 }

//                 // send to sender
//                 ws.send(JSON.stringify(payload));

//                 return;
//             }
//         });

//         // =========================
//         // 🚪 DISCONNECT
//         // =========================
//         ws.on("close", () => {
//             if (ws.user) {
//                 users.delete(ws.user);
//                 console.log("User offline:", ws.user);
//             }

//             // 👥 update everyone
//             broadcastUsers(wss);
//         });
//     });
// }

// module.exports = initWS;


//works perfectly------------------------------------------------------------------------

// const jwt = require("jsonwebtoken");
// const Message = require("../models/Message");

// // 👥 online users: username → ws
// const users = new Map();

// /**
//  * 📢 Send personalized online users list
//  */
// function broadcastUsers(wss) {
//   wss.clients.forEach(client => {
//     if (client.readyState !== 1) return;

//     const currentUser = client.user;

//     const onlineUsers = Array.from(users.keys())
//       .filter(username => username !== currentUser); // 🚫 remove self

//     client.send(JSON.stringify({
//       type: "users",
//       users: onlineUsers
//     }));
//   });
// }

// /**
//  * 📢 broadcast message to all clients
//  */
// function broadcast(wss, data) {
//   wss.clients.forEach(client => {
//     if (client.readyState === 1) {
//       client.send(JSON.stringify(data));
//     }
//   });
// }

// function initWS(wss) {
//   wss.on("connection", (ws) => {
//     console.log("Client connected");

//     ws.on("message", async (raw) => {
//       let data;

//       try {
//         data = JSON.parse(raw);
//       } catch {
//         return;
//       }

//       // =========================
//       // 🔐 AUTH
//       // =========================
//       if (data.type === "auth") {
//         try {
//           const user = jwt.verify(data.token, process.env.JWT_SECRET);

//           ws.user = user.username;

//           // store user
//           users.set(ws.user, ws);

//           ws.send(JSON.stringify({
//             type: "system",
//             message: "authenticated"
//           }));

//           console.log("User online:", ws.user);

//           // 👥 update user lists
//           broadcastUsers(wss);

//         } catch {
//           ws.send(JSON.stringify({
//             type: "error",
//             message: "unauthorized"
//           }));
//         }
//         return;
//       }

//       // =========================
//       // 📢 PUBLIC CHAT
//       // =========================
//       if (data.type === "message") {
//         if (!ws.user) return;

//         const msg = await Message.create({
//           from: ws.user,
//           to: null,
//           text: data.text,
//           time: new Date()
//         });

//         broadcast(wss, {
//           type: "message",
//           from: msg.from,
//           text: msg.text,
//           time: msg.time
//         });

//         return;
//       }

//       // =========================
//       // 💬 PRIVATE DM
//       // =========================
//       if (data.type === "dm") {
//         if (!ws.user) return;

//         const receiverWS = users.get(data.to);

//         const msg = await Message.create({
//           from: ws.user,
//           to: data.to,
//           text: data.text,
//           time: new Date()
//         });

//         const payload = {
//           type: "dm",
//           from: ws.user,
//           to: data.to,
//           text: data.text,
//           time: msg.time
//         };

//         // send to receiver
//         if (receiverWS) {
//           receiverWS.send(JSON.stringify(payload));
//         }

//         // send back to sender
//         ws.send(JSON.stringify(payload));

//         return;
//       }
//     });

//     // =========================
//     // 🚪 DISCONNECT
//     // =========================
//     ws.on("close", () => {
//       if (ws.user) {
//         users.delete(ws.user);
//         console.log("User offline:", ws.user);
//       }

//       broadcastUsers(wss);
//     });
//   });
// }

// module.exports = initWS;
















// // ---
// const jwt = require("jsonwebtoken");
// const Message = require("./models/Message");
// const { pub, sub } = require("./redis");

// // 🧠 only local socket references (NOT for scaling logic)
// const sockets = new Map();

// function initWS(wss) {

//   // =========================
//   // 📡 REDIS SUBSCRIPTIONS
//   // =========================
//   sub.subscribe("chat:public");
//   sub.subscribe("chat:dm");

//   sub.on("message", (channel, message) => {
//     const data = JSON.parse(message);

//     // =========================
//     // 📢 PUBLIC BROADCAST
//     // =========================
//     if (channel === "chat:public") {
//       wss.clients.forEach(client => {
//         if (client.readyState === 1) {
//           client.send(JSON.stringify(data));
//         }
//       });
//     }

//     // =========================
//     // 💬 PRIVATE DM DELIVERY
//     // =========================
//     if (channel === "chat:dm") {
//       const receiverSocket = sockets.get(data.to);

//       if (receiverSocket && receiverSocket.readyState === 1) {
//         receiverSocket.send(JSON.stringify(data));
//       }
//     }
//   });

//   // =========================
//   // 🔌 CONNECTION HANDLER
//   // =========================
//   wss.on("connection", (ws) => {

//     console.log("Client connected");

//     // =========================
//     // 📩 MESSAGE HANDLER
//     // =========================
//     ws.on("message", async (raw) => {
//       let data;

//       try {
//         data = JSON.parse(raw);
//       } catch {
//         return;
//       }

//       // =========================
//       // 🔐 AUTH
//       // =========================
//       if (data.type === "auth") {
//         try {
//           const user = jwt.verify(data.token, process.env.JWT_SECRET);

//           ws.user = user.username;

//           sockets.set(ws.user, ws);

//           ws.send(JSON.stringify({
//             type: "system",
//             message: "authenticated"
//           }));

//           console.log("User online:", ws.user);

//         } catch {
//           ws.send(JSON.stringify({
//             type: "error",
//             message: "unauthorized"
//           }));
//         }

//         return;
//       }

//       // =========================
//       // 📢 PUBLIC MESSAGE (REDIS)
//       // =========================
//       if (data.type === "message") {
//         if (!ws.user) return;

//         const msg = {
//           type: "message",
//           from: ws.user,
//           text: data.text,
//           time: new Date()
//         };

//         await Message.create({
//           from: ws.user,
//           to: null,
//           text: data.text,
//           time: new Date()
//         });

//         // 🚀 broadcast via redis (cross-pod)
//         pub.publish("chat:public", JSON.stringify(msg));

//         return;
//       }

//       // =========================
//       // 💬 PRIVATE DM (REDIS)
//       // =========================
//       if (data.type === "dm") {
//         if (!ws.user) return;

//         const msg = {
//           type: "dm",
//           from: ws.user,
//           to: data.to,
//           text: data.text,
//           time: new Date()
//         };

//         await Message.create({
//           from: ws.user,
//           to: data.to,
//           text: data.text,
//           time: new Date()
//         });

//         // 🚀 send via redis pub/sub
//         pub.publish("chat:dm", JSON.stringify(msg));

//         return;
//       }
//     });

//     // =========================
//     // 🚪 DISCONNECT CLEANUP
//     // =========================
//     ws.on("close", () => {
//       if (ws.user) {
//         sockets.delete(ws.user);
//         console.log("User offline:", ws.user);
//       }
//     });
//   });
// }

// module.exports = initWS;




const jwt = require("jsonwebtoken");
const Message = require("../models/Message"); // ✅ FIX 5: correct path (was "./models/Message")
const { pub, sub } = require("../redis");     // ✅ FIX 5: correct path (was "./redis")

// Local socket references for this pod only
const sockets = new Map();

// ✅ FIX 6: broadcastUsers — sends online list to every connected user,
// excluding themselves from their own list
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

  // Redis subscriptions — receives messages published by any pod
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
      // Deliver to receiver (if connected to this pod)
      const receiverSocket = sockets.get(data.to);
      if (receiverSocket && receiverSocket.readyState === 1) {
        receiverSocket.send(JSON.stringify(data));
      }

      // ✅ FIX: also deliver back to sender (if connected to this pod)
      // so the DM shows up in the sender's chat window too.
      // Works across pods because Redis pub/sub broadcasts to every pod,
      // and only the pod holding that socket will actually deliver.
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

      // AUTH
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

          // ✅ FIX 6: Broadcast updated user list after someone connects
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

        // ✅ FIX 6: Broadcast updated user list after someone disconnects
        broadcastUsers(wss);
      }
    });
  });
}

module.exports = initWS;