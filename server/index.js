const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '50mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(DATA_DIR, 'gallery.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const S3_BUCKET = process.env.S3_BUCKET;
const S3_PUBLIC_BASE =
  process.env.S3_PUBLIC_BASE || (S3_BUCKET ? `https://${S3_BUCKET}.s3.amazonaws.com` : '');
let s3 = null;
let galleryCache = null;

if (S3_BUCKET) {
  try {
    const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
    s3 = {
      client: new S3Client({
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || undefined,
        forcePathStyle: !!process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      }),
      GetObjectCommand,
      PutObjectCommand,
      DeleteObjectCommand,
    };
  } catch (e) {
    console.warn('S3 disabled:', e.message);
  }
}

async function s3Get(key) {
  try {
    const res = await s3.client.send(new s3.GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    const chunks = [];
    for await (const chunk of res.Body) chunks.push(chunk);
    return Buffer.concat(chunks);
  } catch {
    return null;
  }
}

async function s3Put(key, body, contentType) {
  await s3.client.send(
    new s3.PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: body, ContentType: contentType })
  );
}

async function s3Delete(key) {
  try {
    await s3.client.send(new s3.DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
  } catch {}
}

async function loadGallery() {
  if (s3) {
    if (galleryCache) return galleryCache;
    const buf = await s3Get('gallery/index.json');
    if (buf) {
      try {
        galleryCache = JSON.parse(buf.toString('utf8'));
        return galleryCache;
      } catch {}
    }
    galleryCache = { food: [], favorites: [] };
    return galleryCache;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { food: [], favorites: [] };
  }
}

async function saveGallery(g) {
  galleryCache = g;
  if (s3) {
    await s3Put('gallery/index.json', Buffer.from(JSON.stringify(g)), 'application/json');
    return;
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(g));
}

function publicUrlFor(key) {
  if (!key) return key;
  if (key.startsWith('http')) return key;
  if (s3) return `${S3_PUBLIC_BASE}/${key}`;
  return `/api/uploads/${path.basename(key)}`;
}

app.use('/api/uploads', express.static(UPLOADS_DIR));

app.get('/api/gallery', async (req, res) => {
  const g = await loadGallery();
  res.json({ food: g.food.map(publicUrlFor), favorites: g.favorites.map(publicUrlFor) });
});

app.post('/api/gallery/:store', async (req, res) => {
  const { store } = req.params;
  if (store !== 'food' && store !== 'favorites') {
    return res.status(400).json({ error: 'bad store' });
  }
  const { url, index } = req.body || {};
  if (!url || !url.startsWith('data:image/')) {
    return res.status(400).json({ error: 'missing image' });
  }
  const m = url.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!m) {
    return res.status(400).json({ error: 'bad data url' });
  }
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const key = `gallery/${store}/${name}`;
  if (s3) {
    await s3Put(key, Buffer.from(m[2], 'base64'), `image/${m[1]}`);
  } else {
    fs.writeFileSync(path.join(UPLOADS_DIR, name), Buffer.from(m[2], 'base64'));
  }
  const g = await loadGallery();
  const list = g[store];
  if (Number.isInteger(index) && index >= 0 && index < list.length) {
    const old = list[index];
    if (s3) {
      await s3Delete(old);
    } else {
      try {
        fs.unlinkSync(path.join(UPLOADS_DIR, path.basename(old)));
      } catch {}
    }
    list.splice(index, 1, key);
  } else {
    list.push(key);
  }
  await saveGallery(g);
  res.json(list.map(publicUrlFor));
});

app.delete('/api/gallery/:store', async (req, res) => {
  const { store } = req.params;
  if (store !== 'food' && store !== 'favorites') {
    return res.status(400).json({ error: 'bad store' });
  }
  const { index } = req.body || {};
  const g = await loadGallery();
  if (!Number.isInteger(index) || index < 0 || index >= g[store].length) {
    return res.status(400).json({ error: 'bad index' });
  }
  const removed = g[store].splice(index, 1)[0];
  if (s3) {
    await s3Delete(removed);
  } else {
    try {
      fs.unlinkSync(path.join(UPLOADS_DIR, path.basename(removed)));
    } catch {}
  }
  await saveGallery(g);
  res.json(g[store].map(publicUrlFor));
});

const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

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
