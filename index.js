const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-user', (username) => {
    socket.username = username;
    socket.broadcast.emit('chat message', `${username} joined the chat`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', `${socket.username}: ${msg}`);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('chat message', `${socket.username} left the chat`);
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

