// node server which will handle socket io connections
const io = require('socket.io')(8000);
const users = {};

io.on('connection', socket => {
    // if any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', NAME => {
        // console.log("new user", NAME);
        users[socket.id] = NAME;
        socket.broadcast.emit('user-joined', NAME);
    });
    // if someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, NAME: users[socket.id] })
    });
    // if someone leaves the chat, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
