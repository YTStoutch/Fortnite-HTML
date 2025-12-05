const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Sert index.html et tout le dossier
app.use(express.static('.'));

// Liste des joueurs
let players = {};

io.on('connection', socket => {
  console.log('Player connected:', socket.id);
  players[socket.id] = {x:0, y:0, z:0, rotationY:0};
  io.emit('playersUpdate', players);

  socket.on('updatePosition', data => {
    players[socket.id] = data;
    io.emit('playersUpdate', players);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    io.emit('playersUpdate', players);
  });
});

// IMPORTANT : Render fournit son port via process.env.PORT
const PORT = process.env.PORT || 10000; // fallback pour tests locaux
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Empêche le serveur de quitter immédiatement
setInterval(() => {}, 1000);
