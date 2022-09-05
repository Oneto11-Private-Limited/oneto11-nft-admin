const CONF = require('../config');
module.exports = (http) => {
    global.io = require('socket.io')(http);
    io.on('connection', (socket) => {



        socket.on('disconnect', () => {
            console.log('disconnection for ', socket.user, '  socket id =  ', socket.id);
            if (typeof socket.user != 'undefined') {
                delete CONF.USER_SOCKETS[socket.user];
                console.log(Object.keys(CONF.USER_SOCKETS));
            }
        });

        socket.on('chat', (payload) => {})
    });

}