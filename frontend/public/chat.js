const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login.html";
}

const WS_URL =
    window.WS_URL ||
    `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:3001/ws`;

const ws = new WebSocket(WS_URL);


const box = document.getElementById("box");
const usersDiv = document.getElementById("users");
const chatWith = document.getElementById("chatWith");
const msgInput = document.getElementById("msg");

let activeChat = "global";

const chats = {
    global: []
};

ws.onopen = () => {
    ws.send(JSON.stringify({
        type: "auth",
        token
    }));
};

ws.onmessage = (e) => {
    const data = JSON.parse(e.data);

    // USERS LIST
    if (data.type === "users") {
        renderUsers(data.users);
        return;
    }

    // PUBLIC MESSAGE
    if (data.type === "message") {
        if (!chats.global) chats.global = [];

        chats.global.push({
            type: "public",
            text: `${data.from}: ${data.text}`
        });

        if (activeChat === "global") renderChat();
        return;
    }

    // PRIVATE MESSAGE
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

function selectUser(username) {
    activeChat = username;
    chatWith.textContent = username;
    renderChat();
}

function openGlobal() {
    activeChat = "global";
    chatWith.textContent = "Everyone";
    renderChat();
}

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

function logout() {
    ws.close();
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}