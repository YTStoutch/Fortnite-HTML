const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Sert index.html et tout le dossier
app.use(express.static('.'));

// Liste des joueurs connectés
let players = {};

// Quand un joueur se connecte
io.on('connection', socket => {
  console.log('Player connected:', socket.id);
  players[socket.id] = {x:0, y:0, z:0, rotationY:0};

  // Envoie la liste de tous les joueurs
  io.emit('playersUpdate', players);

  // Reçoit la position d’un joueur
  socket.on('updatePosition', data => {
    players[socket.id] = data;
    io.emit('playersUpdate', players);
  });

  // Joueur déconnecté
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    io.emit('playersUpdate', players);
  });
});

// Écoute sur le port fourni par Render
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
