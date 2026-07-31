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

function emptySlot() {
  return { preview: null, confirmed: false };
}

function createRoomState() {
  return {
    round: 1,
    status: 'active',
    creator: emptySlot(),
    joiner: emptySlot(),
    strip: [],
  };
}

function getSlot(room, socketId) {
  if (!room || room.participants.length === 0) return null;
  return room.participants[0].id === socketId
    ? room.roomState.creator
    : room.roomState.joiner;
}

function broadcastRoomState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit('room_state', room.roomState);
}

function advanceRound(room) {
  const s = room.roomState;
  if (s.status !== 'active' || s.round > 3) return;
  if (!s.creator.confirmed || !s.joiner.confirmed) return;
  s.strip.push({ creator: s.creator.preview, joiner: s.joiner.preview });
  s.creator = emptySlot();
  s.joiner = emptySlot();
  s.round += 1;
  if (s.round > 3) s.status = 'complete';
  broadcastRoomState(room.id);
}

io.on('connection', (socket) => {
  let currentRoomId = null;

  socket.on('create_room', () => {
    const roomId = generateRoomId();
    const room = {
      id: roomId,
      participants: [{ id: socket.id }],
      roomState: createRoomState(),
    };
    rooms.set(roomId, room);
    socket.join(roomId);
    currentRoomId = roomId;
    socket.emit('room_created', { roomId, participants: room.participants });
    socket.emit('room_state', room.roomState);
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
    socket.emit('room_state', room.roomState);
    io.to(roomId).emit('participant_joined', { participants: room.participants });
  });

  socket.on('signal', ({ to, signal }) => {
    io.to(to).emit('signal', { from: socket.id, signal });
  });

  socket.on('start_photos', ({ roomId }) => {
    io.to(roomId).emit('photos_started');
  });

  socket.on('set_preview', ({ roomId, preview }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const slot = getSlot(room, socket.id);
    if (!slot) return;
    slot.preview = preview;
    slot.confirmed = false;
    broadcastRoomState(roomId);
  });

  socket.on('retake_photo', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const slot = getSlot(room, socket.id);
    if (!slot) return;
    slot.preview = null;
    slot.confirmed = false;
    broadcastRoomState(roomId);
  });

  socket.on('check_photo', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const slot = getSlot(room, socket.id);
    if (!slot || !slot.preview) return;
    slot.confirmed = true;
    broadcastRoomState(roomId);
    setTimeout(() => advanceRound(room), 1600);
  });

  socket.on('disconnect', () => {
    if (currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        const idx = room.participants.findIndex((p) => p.id === socket.id);
        if (idx !== -1) {
          const slot = idx === 0 ? room.roomState.creator : room.roomState.joiner;
          room.participants.splice(idx, 1);
          if (room.participants.length === 0) {
            rooms.delete(currentRoomId);
          } else {
            slot.preview = null;
            slot.confirmed = false;
            broadcastRoomState(currentRoomId);
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
