const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '50mb' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
  maxHttpBufferSize: 10e6,
});

const PORT = process.env.PORT || 3001;

const rooms = new Map();

function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

io.on('connection', (socket) => {
  let currentRoomId = null;

  socket.on('create_room', () => {
    const roomId = generateRoomId();
    const room = {
      id: roomId,
      participants: [{ id: socket.id }],
      stageData: [{}, {}, {}],
    };
    rooms.set(roomId, room);
    socket.join(roomId);
    currentRoomId = roomId;
    socket.emit('room_created', { roomId, participants: room.participants });
  });

  socket.on('join_room', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found. Check the ID and try again.' });
      return;
    }
    if (room.participants.length >= 2) {
      socket.emit('error', { message: 'This room is already full.' });
      return;
    }
    room.participants.push({ id: socket.id });
    socket.join(roomId);
    currentRoomId = roomId;
    socket.emit('room_joined', { roomId, participants: room.participants });
    io.to(roomId).emit('participant_joined', { participants: room.participants });
  });

  socket.on('signal', ({ to, signal }) => {
    io.to(to).emit('signal', { from: socket.id, signal });
  });

  socket.on('start_photos', ({ roomId }) => {
    io.to(roomId).emit('photos_started');
  });

  socket.on('submit_photo', ({ roomId, photo, stageIndex }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.stageData[stageIndex][socket.id] = { photo, approved: false };
    socket.to(roomId).emit('partner_submitted_photo', {
      photo,
      stageIndex,
      from: socket.id,
    });
  });

  socket.on('approve_photo', ({ roomId, stageIndex }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const stage = room.stageData[stageIndex];
    const otherUser = room.participants.find((p) => p.id !== socket.id);
    if (otherUser && stage[otherUser.id]) {
      stage[otherUser.id].approved = true;
    }
    socket.to(roomId).emit('partner_approved', { stageIndex });
  });

  socket.on('request_retake', ({ roomId, stageIndex }) => {
    socket.to(roomId).emit('partner_requested_retake', { stageIndex });
  });

  socket.on('next_stage', ({ roomId }) => {
    io.to(roomId).emit('advance_stage');
  });

  socket.on('disconnect', () => {
    if (currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        const idx = room.participants.findIndex((p) => p.id === socket.id);
        if (idx !== -1) {
          room.participants.splice(idx, 1);
          if (room.participants.length === 0) {
            rooms.delete(currentRoomId);
          } else {
            io.to(currentRoomId).emit('participant_disconnected', {
              userId: socket.id,
            });
            setTimeout(() => {
              const r = rooms.get(currentRoomId);
              if (r && r.participants.length === 1) {
                io.to(currentRoomId).emit('room_closed');
                rooms.delete(currentRoomId);
              }
            }, 30000);
          }
        }
      }
      currentRoomId = null;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Photo Booth server running on http://localhost:${PORT}`);
});