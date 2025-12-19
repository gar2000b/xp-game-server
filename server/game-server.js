// Game Server - Authoritative source of truth for game state
// This is the core game logic that runs independently of network communication

const GameState = require('./game-state-server');
const GameLoop = require('./game-loop-server');

// Game world configuration - canonical dimensions (server-authoritative)
// These define the game world bounds that all clients must respect
const GAME_WORLD_CONFIG = {
    width: 1680,   // Game world width in pixels/game units
    height: 1050,  // Game world height in pixels/game units
    gravity: 9.81  // Gravity in m/s²
};

class GameServer {
    constructor() {
        // Game state will be managed here
        this.gameState = null;
        this.gameLoop = null;
        this.isRunning = false;
        this.messageHandler = null; // Reference to message handler for sending messages
        
        // Ping mechanism
        this.pingInterval = null;
        this.pingIntervalMs = 1000; // Send ping every 1 second
        
        // Event emitters for state changes (to be connected to message handler)
        this.onStateUpdateCallbacks = [];
        this.onPlayerEventCallbacks = [];
    }
    
    // Set message handler reference (called from index.js)
    setMessageHandler(messageHandler) {
        this.messageHandler = messageHandler;
    }
    
    // Initialize game server
    initialize() {
        // Only initialize if not already initialized
        if (this.gameState) {
            console.log('Game server already initialized');
            return;
        }
        
        // Initialize game state with world dimensions
        this.gameState = new GameState();
        this.gameState.initialize(GAME_WORLD_CONFIG);
        
        // Initialize game loop with game state
        this.gameLoop = new GameLoop(this.gameState, 20); // 20 Hz update rate
        
        // Register game loop to emit state updates
        this.gameLoop.onUpdate((deltaTime, stateSnapshot) => {
            this._emitStateUpdate(stateSnapshot);
        });
        
        console.log(`Game server initialized with world dimensions: ${GAME_WORLD_CONFIG.width}x${GAME_WORLD_CONFIG.height}`);
    }
    
    // Start the game server
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        if (this.gameLoop) {
            this.gameLoop.start();
        }
        
        // Start ping mechanism
        this._startPing();
        
        console.log('Game server started');
    }
    
    // Stop the game server
    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        
        // Stop ping mechanism
        this._stopPing();
        
        if (this.gameLoop) {
            this.gameLoop.stop();
        }
        
        console.log('Game server stopped');
    }
    
    // Get world configuration (for sending to clients on connection)
    getWorldConfig() {
        return {
            width: GAME_WORLD_CONFIG.width,
            height: GAME_WORLD_CONFIG.height,
            gravity: GAME_WORLD_CONFIG.gravity
        };
    }
    
    // Handle player input from client
    handlePlayerInput(playerId, input) {
        // TODO: Validate and process player input
        console.log(`Player ${playerId} input:`, input);
    }
    
    // Handle player connection
    handlePlayerConnect(playerId, connection) {
        // TODO: Add player to game state
        console.log(`Player ${playerId} connected`);
    }
    
    // Handle player disconnection
    handlePlayerDisconnect(playerId) {
        // TODO: Remove player from game state
        console.log(`Player ${playerId} disconnected`);
    }
    
    // Handle start game request from client
    handleStartGame(playerId) {
        // Initialize game server if not already initialized
        if (!this.gameState) {
            this.initialize();
        }
        
        // Start game server if not already running
        if (!this.isRunning) {
            this.start();
        }
        
        console.log(`Game started by player ${playerId}`);
    }
    
    // Handle stop game request from client
    handleStopGame(playerId) {
        console.log(`Player ${playerId} requested to stop game`);
        
        // Check if there are any active players left
        // Note: Currently players aren't tracked in game state yet (TODOs in handlePlayerConnect/Disconnect)
        // So for now, we'll stop the game server when any player requests to stop
        // Later, we can make this smarter by checking if there are other players
        if (this.isRunning) {
            this.stop();
            console.log(`Game server stopped gracefully`);
        } else {
            console.log(`Game server was not running`);
        }
    }
    
    // Register callback for state updates (called by game loop)
    onStateUpdate(callback) {
        this.onStateUpdateCallbacks.push(callback);
    }
    
    // Register callback for player events
    onPlayerEvent(callback) {
        this.onPlayerEventCallbacks.push(callback);
    }
    
    // Emit state update to all registered callbacks
    _emitStateUpdate(state) {
        this.onStateUpdateCallbacks.forEach(callback => callback(state));
    }
    
    // Emit player event to all registered callbacks
    _emitPlayerEvent(playerId, event) {
        this.onPlayerEventCallbacks.forEach(callback => callback(playerId, event));
    }
    
    // Start ping mechanism - sends ping to all connected players
    _startPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        
        this.pingInterval = setInterval(() => {
            if (this.messageHandler && this.isRunning) {
                // Send ping to all connected players via message handler
                // Using numeric value 1 for PING to avoid circular dependency
                const pingPayload = Buffer.allocUnsafe(0);
                this.messageHandler.broadcast(1, pingPayload); // 1 = MESSAGE_TYPE.PING
            }
        }, this.pingIntervalMs);
        
        console.log('Game server ping mechanism started');
    }
    
    // Stop ping mechanism
    _stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
        console.log('Game server ping mechanism stopped');
    }
}


module.exports = GameServer;
