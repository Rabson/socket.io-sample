const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (_, res) => { res.sendFile(__dirname + '/index.html'); });

users = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('setUsername', (data) => {
        if (users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
            socket.username = data
            users.push(data);
            socket.emit('userSet', { username: data });
            io.sockets.emit('userJoined', { username: data });
        }
    });

    socket.on('msg', (data) => { io.sockets.emit('newmsg', data); })

    socket.on('disconnect', () => { io.sockets.emit('userLefted', { username: socket.username }); })
});

http.listen(9000, () => { console.log('listening on localhost:8000'); });