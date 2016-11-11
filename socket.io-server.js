var io = require('socket.io')(8000);

var users = {};

let channel = 'test-channel';

let room = io.of(channel);

room.on('connection', function (socket) {
  
  // when the client emits 'add user', this listens and executes
  socket.on('start', function (uuid, state) {

    // store user in object
    users[uuid] = state;

    socket.uuid = uuid;
    socket.state = state;

    // echo globally (all clients) that a person has connected
    room.emit('join', {
      uuid: uuid,
      state: state
    });

  });

  // when the client emits 'add user', this listens and executes
  socket.on('publish', function (data, fn) {
    io.of(channel).emit('message', data);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('whosonline', function (data, fn) {

    // callback with user data
    fn(users);

  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {

    delete users[socket.uuid];

    // echo globally that this client has left
    socket.broadcast.emit('leave', {
      state: socket.state,
      uuid: socket.uuid
    });

  });


});