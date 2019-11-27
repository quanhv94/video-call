import socketIO from 'socket.io';
import _ from 'lodash';

const setupSocket = (server) => {
  const users = {};
  const io = socketIO(server);
  io.on('connection', (socket) => {
    socket.on('join', (user) => {
      const { username } = user;
      socket.username = username;
      user = users[username] || user;
      user.socketIds = _.concat(user.socketIds || [], socket.id);
      users[username] = user;
      io.emit('users', Object.values(users));
    });

    const leave = () => {
      const user = users[socket.username];
      if (!user) return;
      user.socketIds = _.filter(user.socketIds, x => x !== socket.id);
      if (_.isEmpty(user.socketIds)) {
        delete users[socket.username];
        io.emit('users', Object.values(users));
      }
    };

    socket.on('leave', leave);
    socket.on('disconnect', leave);
  });
};

export default setupSocket;
