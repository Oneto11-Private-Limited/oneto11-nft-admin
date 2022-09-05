const CONF = require('../../config');
module.exports = () => {
    io.on('connection', (socket) => {
        socket.on('message', (payload) => {
            console.log(Object.keys(CONF.USER_SOCKETS))
            io.emit('message_received', payload);
        });

        socket.on('authorize', (payload) => {
            console.log(payload, ' socketid = ', socket.id)
            socket.user = payload;
            CONF.USER_SOCKETS[payload] = socket;

            // io.sockets.emit('online_status',{user_id:'1',online_status:true})
            // io.emit()

        })

        socket.on('typing_status', (payload) => {
            console.log(payload)
            socket.broadcast.emit('typing_status', payload)
                // io.emit()

        })

    });
}