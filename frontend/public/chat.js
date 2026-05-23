
// const ws = new WebSocket("ws://localhost:3001/ws");
// const box = document.getElementById("box");

// // 🚨 AUTH CHECK (redirect if not logged in)
// if (!localStorage.getItem("token")) {
//   window.location.href = "/login.html";
// }

// // 🔐 WebSocket auth
// ws.onopen = () => {
//   ws.send(JSON.stringify({
//     type: "auth",
//     token: localStorage.getItem("token")
//   }));
// };

// // 📩 Receive messages
// ws.onmessage = (e) => {
//   const data = JSON.parse(e.data);

//   if (data.type === "message") {
//     const div = document.createElement("div");
//     div.textContent = `${data.user}: ${data.text}`;
//     box.appendChild(div);
//   }

//   if (data.type === "system") {
//     console.log(data.message);
//   }
// };

// // 📤 Send message
// function send() {
//   const input = document.getElementById("msg");

//   ws.send(JSON.stringify({
//     type: "message",
//     text: input.value
//   }));

//   input.value = "";
// }

// // 🚪 LOGOUT (NEW)
// function logout() {
//   if (ws) {
//     ws.close(); // close websocket connection
//   }

//   localStorage.removeItem("token"); // remove JWT
//   window.location.href = "/login.html"; // redirect
// }





// const token = localStorage.getItem("token");

// if (!token) {
//     window.location.href = "/login.html";
// }

// const ws = new WebSocket("ws://localhost:3001/ws");

// const box = document.getElementById("box");
// const usersDiv = document.getElementById("users");
// const chatWith = document.getElementById("chatWith");

// let selectedUser = null;

// // =========================
// // 🔐 AUTH
// // =========================
// ws.onopen = () => {
//     ws.send(JSON.stringify({
//         type: "auth",
//         token
//     }));
// };

// // =========================
// // 📩 RECEIVE MESSAGES
// // =========================
// ws.onmessage = (e) => {
//     const data = JSON.parse(e.data);

//     // =========================
//     // 💬 PUBLIC MESSAGE
//     // =========================
//     if (data.type === "message") {
//         const div = document.createElement("div");
//         div.textContent = `${data.from}: ${data.text}`;
//         box.appendChild(div);
//     }

//     // =========================
//     // 💬 PRIVATE MESSAGE (DM)
//     // =========================
//     if (data.type === "dm") {
//         const div = document.createElement("div");
//         div.style.color = "green";
//         div.textContent = `(DM) ${data.from} → ${data.to}: ${data.text}`;
//         box.appendChild(div);
//     }

//     // =========================
//     // 👥 ONLINE USERS UPDATE
//     // (optional if backend sends it later)
//     // =========================
//     if (data.type === "users") {
//         renderUsers(data.users);
//     }
// };

// // =========================
// // 👥 CLICK USER TO DM
// // =========================
// function selectUser(username) {
//     selectedUser = username;
//     chatWith.textContent = username;
// }

// // =========================
// // 📢 PUBLIC MESSAGE
// // =========================
// function sendPublic() {
//     const input = document.getElementById("msg");

//     if (!input.value.trim()) return;

//     ws.send(JSON.stringify({
//         type: "message",
//         text: input.value
//     }));

//     input.value = "";
// }

// // =========================
// // 💬 PRIVATE MESSAGE (DM)
// // =========================
// function sendPrivate() {
//     const input = document.getElementById("msg");

//     if (!selectedUser) {
//         alert("Select a user to DM");
//         return;
//     }

//     if (!input.value.trim()) return;

//     ws.send(JSON.stringify({
//         type: "dm",
//         to: selectedUser,
//         text: input.value
//     }));

//     input.value = "";
// }

// // =========================
// // 👥 RENDER USERS LIST
// // =========================
// function renderUsers(users) {
//     usersDiv.innerHTML = "";

//     users.forEach(u => {
//         const div = document.createElement("div");

//         div.textContent = u;
//         div.style.cursor = "pointer";
//         div.style.padding = "5px";
//         div.style.borderBottom = "1px solid #eee";

//         div.onclick = () => selectUser(u);

//         usersDiv.appendChild(div);
//     });
// }

// // =========================
// // 🚪 LOGOUT
// // =========================
// function logout() {
//     ws.close();
//     localStorage.removeItem("token");
//     window.location.href = "/login.html";
// }



// const token = localStorage.getItem("token");

// if (!token) {
//     window.location.href = "/login.html";
// }

// // 🌐 WebSocket
// const ws = new WebSocket("ws://localhost:3001/ws");

// const box = document.getElementById("box");
// const usersDiv = document.getElementById("users");
// const chatWith = document.getElementById("chatWith");
// const msgInput = document.getElementById("msg");

// // =========================
// // 🧠 STATE
// // =========================
// let activeChat = "global";

// // 🗂️ MESSAGE STORAGE
// const chats = {
//     global: []
// };

// // =========================
// // 🔐 AUTH
// // =========================
// ws.onopen = () => {
//     ws.send(JSON.stringify({
//         type: "auth",
//         token
//     }));
// };

// // =========================
// // 📩 RECEIVE MESSAGES
// // =========================
// ws.onmessage = (e) => {
//     const data = JSON.parse(e.data);

//     // 👥 USERS LIST
//     if (data.type === "users") {
//         renderUsers(data.users);
//         return;
//     }

//     // 📢 PUBLIC MESSAGE
//     if (data.type === "message") {
//         if (!chats.global) chats.global = [];

//         chats.global.push({
//             type: "public",
//             text: `${data.from}: ${data.text}`
//         });

//         if (activeChat === "global") {
//             renderChat();
//         }

//         return;
//     }

//     // 💬 PRIVATE MESSAGE (DM)
//     if (data.type === "dm") {

//         if (!chats[data.from]) chats[data.from] = [];
//         if (!chats[data.to]) chats[data.to] = [];

//         const msg = {
//             type: "dm",
//             text: `(DM) ${data.from}: ${data.text}`
//         };

//         chats[data.from].push(msg);
//         chats[data.to].push(msg);

//         if (activeChat === data.from || activeChat === data.to) {
//             renderChat();
//         }

//         return;
//     }
// };

// // =========================
// // 👥 USERS LIST UI
// // =========================
// function renderUsers(users) {
//     usersDiv.innerHTML = "";

//     // 🌍 Everyone
//     const globalDiv = document.createElement("div");
//     globalDiv.textContent = "🌍 Everyone";
//     globalDiv.style.cursor = "pointer";
//     globalDiv.style.fontWeight = "bold";

//     globalDiv.onclick = () => openGlobal();

//     usersDiv.appendChild(globalDiv);

//     // 👤 USERS
//     users.forEach(user => {
//         const div = document.createElement("div");

//         div.textContent = user;
//         div.style.cursor = "pointer";
//         div.style.padding = "5px";

//         div.onclick = () => selectUser(user);

//         usersDiv.appendChild(div);
//     });
// }

// // =========================
// // 💬 SWITCH CHAT (DM)
// // =========================
// function selectUser(username) {
//     activeChat = username;
//     chatWith.textContent = username;

//     renderChat();
// }

// // =========================
// // 🌍 GLOBAL CHAT
// // =========================
// function openGlobal() {
//     activeChat = "global";
//     chatWith.textContent = "Everyone";

//     renderChat();
// }

// // =========================
// // 🧠 RENDER CHAT WINDOW
// // =========================
// function renderChat() {
//     box.innerHTML = "";

//     const messages = chats[activeChat] || [];

//     messages.forEach(msg => {
//         const div = document.createElement("div");
//         div.textContent = msg.text;

//         if (msg.type === "dm") {
//             div.style.color = "green";
//         }

//         box.appendChild(div);
//     });

//     box.scrollTop = box.scrollHeight;
// }

// // =========================
// // 📤 SINGLE SEND BUTTON (IMPORTANT)
// // =========================
// function sendMessage() {
//     const text = msgInput.value;

//     if (!text.trim()) return;

//     // 🌍 PUBLIC CHAT
//     if (activeChat === "global") {
//         ws.send(JSON.stringify({
//             type: "message",
//             text
//         }));
//     }

//     // 💬 PRIVATE CHAT
//     else {
//         ws.send(JSON.stringify({
//             type: "dm",
//             to: activeChat,
//             text
//         }));
//     }

//     msgInput.value = "";
// }

// // =========================
// // 🚪 LOGOUT
// // =========================
// function logout() {
//     ws.close();
//     localStorage.removeItem("token");
//     window.location.href = "/login.html";
// }





// // =========================
// // 🔐 AUTH TOKEN
// // =========================
// const token = localStorage.getItem("token");

// if (!token) {
//     window.location.href = "/login.html";
// }

// // =========================
// // 🌐 KUBERNETES-READY WEBSOCKET
// // =========================

// // Priority:
// // 1. window.WS_URL (K8s / production injection)
// // 2. fallback local dev

// const WS_URL =
//     window.WS_URL ||
//     `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:3001/ws`;

// const ws = new WebSocket(WS_URL);

// // =========================
// // 📦 DOM ELEMENTS
// // =========================
// const box = document.getElementById("box");
// const usersDiv = document.getElementById("users");
// const chatWith = document.getElementById("chatWith");
// const msgInput = document.getElementById("msg");

// // =========================
// // 🧠 STATE
// // =========================
// let activeChat = "global";

// const chats = {
//     global: []
// };

// // =========================
// // 🔐 AUTH ON CONNECT
// // =========================
// ws.onopen = () => {
//     ws.send(JSON.stringify({
//         type: "auth",
//         token
//     }));
// };

// // =========================
// // 📩 RECEIVE MESSAGES
// // =========================
// ws.onmessage = (e) => {
//     const data = JSON.parse(e.data);

//     // 👥 USERS LIST
//     if (data.type === "users") {
//         renderUsers(data.users);
//         return;
//     }

//     // 📢 PUBLIC MESSAGE
//     if (data.type === "message") {
//         if (!chats.global) chats.global = [];

//         chats.global.push({
//             type: "public",
//             text: `${data.from}: ${data.text}`
//         });

//         if (activeChat === "global") renderChat();
//         return;
//     }

//     // 💬 PRIVATE MESSAGE
//     if (data.type === "dm") {

//         if (!chats[data.from]) chats[data.from] = [];
//         if (!chats[data.to]) chats[data.to] = [];

//         const msg = {
//             type: "dm",
//             text: `(DM) ${data.from}: ${data.text}`
//         };

//         chats[data.from].push(msg);
//         chats[data.to].push(msg);

//         if (activeChat === data.from || activeChat === data.to) {
//             renderChat();
//         }

//         return;
//     }
// };

// // =========================
// // 👥 USERS LIST
// // =========================
// function renderUsers(users) {
//     usersDiv.innerHTML = "";

//     const globalDiv = document.createElement("div");
//     globalDiv.textContent = "🌍 Everyone";
//     globalDiv.style.cursor = "pointer";
//     globalDiv.style.fontWeight = "bold";
//     globalDiv.onclick = openGlobal;

//     usersDiv.appendChild(globalDiv);

//     users.forEach(user => {
//         const div = document.createElement("div");
//         div.textContent = user;
//         div.style.cursor = "pointer";
//         div.style.padding = "5px";
//         div.onclick = () => selectUser(user);
//         usersDiv.appendChild(div);
//     });
// }

// // =========================
// // 💬 SWITCH TO USER CHAT
// // =========================
// function selectUser(username) {
//     activeChat = username;
//     chatWith.textContent = username;
//     renderChat();
// }

// // =========================
// // 🌍 SWITCH TO GLOBAL CHAT
// // =========================
// function openGlobal() {
//     activeChat = "global";
//     chatWith.textContent = "Everyone";
//     renderChat();
// }

// // =========================
// // 🧠 RENDER CHAT
// // =========================
// function renderChat() {
//     box.innerHTML = "";

//     const messages = chats[activeChat] || [];

//     messages.forEach(msg => {
//         const div = document.createElement("div");
//         div.textContent = msg.text;

//         if (msg.type === "dm") {
//             div.style.color = "green";
//         }

//         box.appendChild(div);
//     });

//     box.scrollTop = box.scrollHeight;
// }

// // =========================
// // 📤 SEND MESSAGE (AUTO ROUTE)
// // =========================
// function sendMessage() {
//     const text = msgInput.value;

//     if (!text.trim()) return;

//     if (activeChat === "global") {
//         ws.send(JSON.stringify({
//             type: "message",
//             text
//         }));
//     } else {
//         ws.send(JSON.stringify({
//             type: "dm",
//             to: activeChat,
//             text
//         }));
//     }

//     msgInput.value = "";
// }

// // =========================
// // 🚪 LOGOUT
// // =========================
// function logout() {
//     ws.close();
//     localStorage.removeItem("token");
//     window.location.href = "/login.html";
// }













// =========================
// 🔐 AUTH TOKEN
// =========================
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login.html";
}

// =========================
// 🌐 KUBERNETES-READY WEBSOCKET
// =========================

// Priority:
// 1. window.WS_URL (K8s / production injection)
// 2. fallback local dev

const WS_URL =
    window.WS_URL ||
    `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:3001/ws`;

const ws = new WebSocket(WS_URL);

// =========================
// 📦 DOM ELEMENTS
// =========================
const box = document.getElementById("box");
const usersDiv = document.getElementById("users");
const chatWith = document.getElementById("chatWith");
const msgInput = document.getElementById("msg");

// =========================
// 🧠 STATE
// =========================
let activeChat = "global";

const chats = {
    global: []
};

// =========================
// 🔐 AUTH ON CONNECT
// =========================
ws.onopen = () => {
    ws.send(JSON.stringify({
        type: "auth",
        token
    }));
};

// =========================
// 📩 RECEIVE MESSAGES
// =========================
ws.onmessage = (e) => {
    const data = JSON.parse(e.data);

    // 👥 USERS LIST
    if (data.type === "users") {
        renderUsers(data.users);
        return;
    }

    // 📢 PUBLIC MESSAGE
    if (data.type === "message") {
        if (!chats.global) chats.global = [];

        chats.global.push({
            type: "public",
            text: `${data.from}: ${data.text}`
        });

        if (activeChat === "global") renderChat();
        return;
    }

    // 💬 PRIVATE MESSAGE
    if (data.type === "dm") {

        if (!chats[data.from]) chats[data.from] = [];
        if (!chats[data.to]) chats[data.to] = [];

        const msg = {
            type: "dm",
            text: `(DM) ${data.from}: ${data.text}`
        };

        chats[data.from].push(msg);
        chats[data.to].push(msg);

        if (activeChat === data.from || activeChat === data.to) {
            renderChat();
        }

        return;
    }
};

// =========================
// 👥 USERS LIST
// =========================
function renderUsers(users) {
    usersDiv.innerHTML = "";

    const globalDiv = document.createElement("div");
    globalDiv.textContent = "🌍 Everyone";
    globalDiv.style.cursor = "pointer";
    globalDiv.style.fontWeight = "bold";
    globalDiv.onclick = openGlobal;

    usersDiv.appendChild(globalDiv);

    users.forEach(user => {
        const div = document.createElement("div");
        div.textContent = user;
        div.style.cursor = "pointer";
        div.style.padding = "5px";
        div.onclick = () => selectUser(user);
        usersDiv.appendChild(div);
    });
}

// =========================
// 💬 SWITCH TO USER CHAT
// =========================
function selectUser(username) {
    activeChat = username;
    chatWith.textContent = username;
    renderChat();
}

// =========================
// 🌍 SWITCH TO GLOBAL CHAT
// =========================
function openGlobal() {
    activeChat = "global";
    chatWith.textContent = "Everyone";
    renderChat();
}

// =========================
// 🧠 RENDER CHAT
// =========================
function renderChat() {
    box.innerHTML = "";

    const messages = chats[activeChat] || [];

    messages.forEach(msg => {
        const div = document.createElement("div");
        div.textContent = msg.text;

        if (msg.type === "dm") {
            div.style.color = "green";
        }

        box.appendChild(div);
    });

    box.scrollTop = box.scrollHeight;
}

// =========================
// 📤 SEND MESSAGE (AUTO ROUTE)
// =========================
function sendMessage() {
    const text = msgInput.value;

    if (!text.trim()) return;

    if (activeChat === "global") {
        ws.send(JSON.stringify({
            type: "message",
            text
        }));
    } else {
        ws.send(JSON.stringify({
            type: "dm",
            to: activeChat,
            text
        }));
    }

    msgInput.value = "";
}

// =========================
// 🚪 LOGOUT
// =========================
function logout() {
    ws.close();
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}