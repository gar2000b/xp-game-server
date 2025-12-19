// Message Handler - Routes messages between WebSocket and Game Server
// Acts as an adapter layer between network communication and game logic

class MessageHandler {
    constructor(gameServer) {
        this.gameServer = gameServer;
        this.connections = new Map(); // connection -> playerId mapping
        
        // Register game server callbacks
        this._setupGameServerCallbacks();
    }
    
    // Setup callbacks from game server
    _setupGameServerCallbacks() {
        // When game state updates, send to all connected clients
        this.gameServer.onStateUpdate((state) => {
            this.broadcastStateUpdate(state);
        });
        
        // When player events occur, send to specific client
        this.gameServer.onPlayerEvent((playerId, event) => {
            this.sendPlayerEvent(playerId, event);
        });
    }
    
    // Message types (should match index.js)
    static MESSAGE_TYPE = {
        PING: 1,
        PONG: 2,
        GAME_STATE: 3,
        START_GAME: 4,
        STOP_GAME: 5
    };
    
    // Handle incoming message from WebSocket
    handleMessage(connection, messageType, payload) {
        const playerId = this.connections.get(connection);
        
        if (!playerId) {
            console.warn('Received message from unregistered connection');
            return;
        }
        
        // Route message to game server (even PING/PONG go through to prove architecture)
        console.log(`[MessageHandler] Routing message from player ${playerId}: type=${messageType}, payload length=${payload.length}`);
        
        // Route PING/PONG through game server
        if (messageType === MessageHandler.MESSAGE_TYPE.PING) {
            // Client sent PING, respond with PONG
            console.log(`[MessageHandler] PING from ${playerId} - responding with PONG`);
            const pongPayload = Buffer.allocUnsafe(0);
            this.sendToClient(connection, MessageHandler.MESSAGE_TYPE.PONG, pongPayload);
        } else if (messageType === MessageHandler.MESSAGE_TYPE.PONG) {
            // Client responded to our PING
            console.log(`[MessageHandler] PONG from ${playerId} - connection healthy`);
            // PONG received, no response needed
        } else if (messageType === MessageHandler.MESSAGE_TYPE.START_GAME) {
            // Initialize and start game server when user starts a game
            console.log(`[MessageHandler] START_GAME from ${playerId} - initializing game server`);
            this.gameServer.handleStartGame(playerId);
        } else if (messageType === MessageHandler.MESSAGE_TYPE.STOP_GAME) {
            // Stop game server when user exits game
            console.log(`[MessageHandler] STOP_GAME from ${playerId} - stopping game server`);
            this.gameServer.handleStopGame(playerId);
        }
        
        // TODO: Route other message types to appropriate game server methods
        // Example routing (to be expanded):
        // if (messageType === MESSAGE_TYPE.PLAYER_INPUT) {
        //     const input = parseInput(payload);
        //     this.gameServer.handlePlayerInput(playerId, input);
        // }
    }
    
    // Register a new connection
    registerConnection(connection, playerId) {
        this.connections.set(connection, playerId);
        this.gameServer.handlePlayerConnect(playerId, connection);
    }
    
    // Unregister a connection
    unregisterConnection(connection) {
        const playerId = this.connections.get(connection);
        if (playerId) {
            this.connections.delete(connection);
            this.gameServer.handlePlayerDisconnect(playerId);
        }
    }
    
    // Send message to specific client via WebSocket
    // Note: This is called from message handler, but actual WebSocket.send() happens in index.js
    // We'll need to store the connection's socket reference or use a callback
    sendToClient(connection, messageType, payload) {
        // Create GameEnvelope: header + payload
        const payloadLength = payload ? payload.length : 0;
        const buffer = Buffer.allocUnsafe(4 + payloadLength);
        
        // Write header (little-endian)
        buffer.writeUInt16LE(messageType, 0);
        buffer.writeUInt16LE(payloadLength, 2);
        
        // Write payload if present
        if (payload && payloadLength > 0) {
            if (Buffer.isBuffer(payload)) {
                payload.copy(buffer, 4);
            } else {
                buffer.write(payload, 4);
            }
        }
        
        // Send via WebSocket (connection.socket is the WebSocket instance)
        if (connection.socket && connection.socket.readyState === 1) { // WebSocket.OPEN
            connection.socket.send(buffer);
            const playerId = this.connections.get(connection);
            console.log(`[MessageHandler] Sent message to ${playerId}: type=${messageType}, payload length=${payloadLength}`);
        }
    }
    
    // Broadcast message to all connected clients
    broadcast(messageType, payload) {
        this.connections.forEach((playerId, connection) => {
            this.sendToClient(connection, messageType, payload);
        });
    }
    
    // Broadcast game state update to all clients
    broadcastStateUpdate(state) {
        // TODO: Serialize state and broadcast
        console.log('Broadcasting state update to all clients');
    }
    
    // Send player-specific event
    sendPlayerEvent(playerId, event) {
        // TODO: Find connection for playerId and send event
        const connection = Array.from(this.connections.entries())
            .find(([conn, pid]) => pid === playerId)?.[0];
        
        if (connection) {
            // TODO: Send event
            console.log(`Sending event to player ${playerId}`);
        }
    }
}

module.exports = MessageHandler;
