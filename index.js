const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const event = {
    server: {
        setUsername: 'setUsername',
        msg: 'msg',
    },
    client: {
        userSet: 'userSet',
        userExists: 'userExists',
        newMsg: 'newMsg',
        userJoined: 'userJoined',
        userLeft: 'userLeft',
    },
    flow: `
    1. connect to socket.
    2. send "setUsername" event with data  { username: "yogi" } to server .
    3. on client listen on "userSet" event for successfully with name. 
       in case user exist with same name error will throw on with "userExists" event.
    4. after above flow send message data to server with "msg" event with data {message: "some message", timestamp: "1234562" }.
       and on client listen for "newMsg" event for new messages
    `
};

app.get('/', (_, res) => { res.sendFile(__dirname + '/index.html'); });

app.get('/events', (_, res) => {
    res.send(event);
});

users = [];


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on(event.server.setUsername, ({ username }) => {
        if (users.indexOf(username) > -1) {
            socket.emit(event.client.userExists, username + ' username is taken! Try some other username.');
        } else {
            socket.username = username
            users.push(username);
            socket.emit(event.client.userSet, { username });
            io.sockets.emit(event.client.userJoined, { username });
        }
    });

    socket.on(event.server.msg, (data) => {
        io.sockets.emit(event.client.newMsg, { message: data.message, timestamp: data.timestamp || Date.now(), name: socket.username, });
    })

    socket.on('disconnect', (data) => {
        users = users.filter(user => user !== socket.username)
        io.sockets.emit('userLeft', { username: socket.username });
    })
});

http.listen(9000, () => { console.log('listening on localhost:9000'); });