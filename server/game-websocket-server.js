// Game WebSocket Handler - Manages WebSocket connections for the game
// Handles connection lifecycle and routes messages through message handler

class GameWebSocket {
    constructor(fastify, messageHandler) {
        this.fastify = fastify;
        this.messageHandler = messageHandler;
        this.nextPlayerId = 1;
        
        // Setup WebSocket endpoint
        this._setupWebSocket();
    }
    
    // Setup WebSocket endpoint
    _setupWebSocket() {
        this.fastify.register(async (fastify) => {
            fastify.get('/ws', { websocket: true }, (connection, req) => {
                // Generate unique player ID for this connection
                const playerId = `player-${this.nextPlayerId++}`;
                console.log(`WebSocket client connected: ${playerId}`);
                
                // Register connection with message handler
                this.messageHandler.registerConnection(connection, playerId);
                
                connection.socket.on('message', (message) => {
                    // Handle binary message (Node.js receives as Buffer)
                    if (Buffer.isBuffer(message)) {
                        // Read header (little-endian)
                        const messageType = message.readUInt16LE(0);
                        const payloadLength = message.readUInt16LE(2);
                        const payload = message.slice(4, 4 + payloadLength);
                        
                        // Route message through message handler to game server
                        this.messageHandler.handleMessage(connection, messageType, payload);
                    }
                });
                
                connection.socket.on('close', () => {
                    console.log(`WebSocket client disconnected: ${playerId}`);
                    this.messageHandler.unregisterConnection(connection);
                });
                
                connection.socket.on('error', (error) => {
                    console.error(`WebSocket error for ${playerId}:`, error);
                    this.messageHandler.unregisterConnection(connection);
                });
            });
        });
    }
}

module.exports = GameWebSocket;
