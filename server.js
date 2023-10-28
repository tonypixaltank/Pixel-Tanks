const {ffaopen, ffamessage, ffaclose} = require('./ffa-server.js');
const {MongoClient} = require('mongodb');
const schemapack = require('schemapack');
const schema = schemapack.build({
  username: 'string',
  type: 'string',
  gamemode: 'string',
  op: 'string',
  token: 'int16',
  password: 'string',
  key: 'string',
  value: {
    'pixel-tanks': {
      username: 'string',
      class: 'string',
      cosmetic: 'string',
      cosmetics: ['string'],
      deathEffect: 'string',
      deathEffects: ['string'],
      color: 'string',
      stats: ['int16'],
      classes: ['boolean'],
      items: ['string'],
      keybinds: {
        items: ['int16'],
        emotes: ['int16'],    
      },
    }
  },
  tank: {
    rank: 'int16',
    username: 'string',
    class: 'string',
    cosmetic: 'string',
    deathEffect: 'string',
    color: 'string',
    x: 'int16',
    y: 'int16',
    r: 'int16',
    use: ['string'],
    fire: [{
      x: 'int16',
      y: 'int16',
      type: 'string',
      r: 'int16',
    }],
    baseFrame: 'int16',
    baseRotation: 'int16',
    invis: 'boolean',
    immune: 'boolean',
    animation: {
      id: 'string',
      frame: 'int16',
    },
    airstrike: {
      x: 'int16',
      y: 'int16',
    },
  },
  id: 'float32',
  room: 'float32',
  data: ['string'],
  b: [{
    x: 'int16',
    y: 'int16', 
    maxHp: 'int16',
    hp: 'int16',
    type: 'string',
    s: 'boolean',
    team: 'string',
    id: 'float32',
  }],
  pt: [{
    rank: 'int16',
    username: 'string',
    cosmetic: 'string',
    color: 'string',
    damage: {
      x: 'int16',
      y: 'int16',
      d: 'int16',
    },
    maxHp: 'int16',
    hp: 'int16',
    shields: 'int16',
    team: 'string',
    x: 'int16',
    y: 'int16',
    r: 'int16',
    ded: 'boolean',
    pushback: 'int16',
    baseRotation: 'int16', 
    baseFrame: 'int16',
    fire: {
      frame: 'int16',
    },
    animation: {}, // FIX
    buff: 'boolean',
    invis: 'boolean',
    id: 'float32',
    class: 'string',
    flashbanged: 'boolean',
    dedEffect: 'string',
  }],
  ai: [{
    role: 'int16',
    x: 'int16',
    y: 'int16',
    r: 'int16',
    baseRotation: 'int16',
    baseFrame: 'int16',
    mode: 'int16',
    rank: 'int16',
    hp: 'int16',
    maxHp: 'int16',
    pushback: 'int16',
    cosmetic: 'string',
    id: 'float32',
    fire: {
      frame: 'int16',
    },
    damage: {
      x: 'int16',
      y: 'int16',
      d: 'int16',
    },
    team: 'string',
    color: 'string',
  }],
  s: [{
    team: 'string',
    r: 'int16',
    type: 'string',
    x: 'int16',
    y: 'int16',
    sx: 'int16',
    sy: 'int16',
    id: 'float32',
  }],
  d: [{
    x: 'int16',
    y: 'int16',
    w: 'int16',
    h: 'int16',
    f: 'int16',
    id: 'float32',
  }],
  logs: [{
    m: 'string',
    c: 'string',
  }],
  global: 'string',
  tickspeed: 'string',
  event: 'string',
  delete: {
    b: ['float32'],
    pt: ['float32'],
    ai: ['float32'],
    s: ['float32'],
    d: ['float32'],
  },
});
const client = new MongoClient('mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority');
const tokens = new Set(), sockets = new Set();
const valid = (token, username) => tokens.has(`${token}:${username}`);
const auth = async({username, type, password}, socket) => {
  const item = await db.findOne({username}), token = Math.random();
  if (type === 'signup') {
    if (item !== null) return socket.send({status: 'error', message: 'This account already exists.'});
    await db.insertOne({username, password, playerdata: '{}'});
  } else if (type === 'login') {
    if (item === null) return socket.send({status: 'error', message: 'This account does not exist.'});
    if (item.password !== password) return socket.send({status: 'error', message: 'Incorrect password.'});
  } else return;
  socket.send({status: 'success', token});
  tokens.add(`${token}:${username}`);
}
const database = async({token, username, type, key, value}, socket) => {
  if (!token) return socket.send({status: 'error', message: 'No token.'});
  if (!valid(token, username)) return socket.send({status: 'error', message: 'Invalid Token.'});
  if (type === 'get') {
    socket.send({status: 'success', type, data: await db.findOne({username}, {projection: {password: 0}})});
  } else if (type === 'set') {
    await db.findOneAndUpdate({username}, {$set: {[key]: value}});
  }
}

let db;
(async () => {
  await client.connect();
  db = client.db('data').collection('data');
})();

const server = Bun.serve({
  port: process.env.PORT || 80,
  fetch(req, server) {
    const url = new URL(req.url);
    if (server.upgrade(req, {data: {isMain: url.pathname === '/'}})) return;
    if (url.pathname === '/') return new Response(Bun.file('./public/js/pixel-tanks.js'));
    if (url.pathname === '/play') return new Response(`<script src='/'></script>`);
    if (url.pathname === '/verify') return new Reponse(valid(req.query.token, req.query.username).toString());
  },
  websocket: {
    open(socket) {
      if (socket.data.isMain) {
        sockets.add(socket);
        socket._send = socket.send;
        socket.send = data => socket._send(schema.encode(data));
      } else ffaopen(socket);
    },
    message(socket, data) {
      if (socket.data.isMain) {
      try {
        data = schema.decode(data);
      } catch(e) {
        return socket.close();
      }
      if (!socket.username) socket.username = data.username;
      if (data.op === 'database') database(data, socket);
      if (data.op === 'auth') auth(data, socket);
      } else ffamessage(socket, data);
    },
    close(socket, code, reason) {
      if (socket.data.isMain) {
        sockets.delete(socket);
      }  else ffaclose(socket, code, reason);
    }
  },
});
