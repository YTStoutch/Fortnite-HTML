const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('.'));

let players = {};

io.on('connection', socket => {
  console.log('Player connected:', socket.id);
  players[socket.id] = {x:0,y:0,z:0,rotationY:0};
  io.emit('playersUpdate', players);

  socket.on('updatePosition', data => {
    players[socket.id] = data;
    io.emit('playersUpdate', players);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('playersUpdate', players);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
