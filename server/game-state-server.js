// Game State Management - Manages all game entities and world state
// This is the authoritative data store for the game

const GameWorld = require('../models/game-world');

class GameState {
    constructor() {
        this.players = new Map(); // playerId -> player data
        this.aiPlayers = new Map(); // aiPlayerId -> AI player data
        this.projectiles = new Map(); // projectileId -> projectile data
        this.world = null; // World/level state
    }
    
    // Initialize game state with world configuration
    initialize(worldConfig) {
        // Initialize game world with server-authoritative dimensions
        this.world = new GameWorld();
        this.world.initialize(worldConfig.width, worldConfig.height);
        this.world.gravity = worldConfig.gravity;
        
        console.log(`Game state initialized with world: ${worldConfig.width}x${worldConfig.height}`);
    }
    
    // Player management
    addPlayer(playerId, playerData) {
        // TODO: Add player to state
        this.players.set(playerId, playerData);
    }
    
    removePlayer(playerId) {
        // TODO: Remove player from state
        this.players.delete(playerId);
    }
    
    getPlayer(playerId) {
        return this.players.get(playerId);
    }
    
    getAllPlayers() {
        return Array.from(this.players.values());
    }
    
    // AI Player management
    addAIPlayer(aiPlayerId, aiPlayerData) {
        // TODO: Add AI player to state
        this.aiPlayers.set(aiPlayerId, aiPlayerData);
    }
    
    removeAIPlayer(aiPlayerId) {
        // TODO: Remove AI player from state
        this.aiPlayers.delete(aiPlayerId);
    }
    
    getAIPlayer(aiPlayerId) {
        return this.aiPlayers.get(aiPlayerId);
    }
    
    getAllAIPlayers() {
        return Array.from(this.aiPlayers.values());
    }
    
    // Get snapshot of current game state (for sending to clients)
    getStateSnapshot() {
        // Create serializable snapshot of current state
        return {
            players: this.getAllPlayers().map(p => p.serialize ? p.serialize() : p),
            aiPlayers: this.getAllAIPlayers().map(ai => ai.serialize ? ai.serialize() : ai),
            projectiles: Array.from(this.projectiles.values()),
            world: this.world ? this.world.serialize() : null
        };
    }
    
    // Update entity position
    updateEntityPosition(entityId, x, y, vx, vy) {
        // TODO: Update entity position in state
        // This will be called by game loop
    }
}

module.exports = GameState;
