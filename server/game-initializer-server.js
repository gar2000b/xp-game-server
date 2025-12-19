// Game Initializer - Initializes all game server components
// This is the single entry point for game server setup

const GameServer = require('./game-server');
const MessageHandler = require('./message-handler-server');
const GameWebSocket = require('./game-websocket-server');

class GameInitializer {
    constructor(fastify) {
        this.fastify = fastify;
        
        // Initialize game server components in order
        this.gameServer = new GameServer();
        this.messageHandler = new MessageHandler(this.gameServer);
        
        // Give game server access to message handler for sending messages
        this.gameServer.setMessageHandler(this.messageHandler);
        
        // Initialize WebSocket handler with game server components
        this.gameWebSocket = new GameWebSocket(fastify, this.messageHandler);
    }
}

module.exports = GameInitializer;
