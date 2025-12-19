const fastify = require('fastify')({ logger: true });
const path = require('path');
const GameInitializer = require('./server/game-initializer-server');

var userName = "Gary Black";

// Register static file serving
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

// Register WebSocket support
fastify.register(require('@fastify/websocket'));

// Initialize game server-side (single entry point)
new GameInitializer(fastify);

fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html');
});

fastify.get('/welcome', async (request, reply) => {
  const message = `Hello World ${userName}`;
  console.log(message);
  return { message: message };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server listening on http://localhost:3000');
    console.log('Game server will initialize when a player starts a game');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();