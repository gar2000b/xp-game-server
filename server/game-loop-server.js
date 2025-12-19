// Server-Side Game Loop - Runs physics and game logic updates
// This runs at a fixed rate (e.g., 20-60 Hz) independent of client rendering

class GameLoop {
    constructor(gameState, updateRate = 20) {
        this.gameState = gameState;
        this.updateRate = updateRate; // Updates per second
        this.updateInterval = 1000 / updateRate; // Milliseconds per update
        this.isRunning = false;
        this.intervalId = null;
        this.lastUpdateTime = null;
        
        // Callbacks for state updates
        this.onUpdateCallbacks = [];
    }
    
    // Start the game loop
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastUpdateTime = Date.now();
        
        // Run game loop
        this._tick();
        console.log(`Game loop started at ${this.updateRate} Hz`);
    }
    
    // Stop the game loop
    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log('Game loop stopped');
    }
    
    // Main game loop tick
    _tick() {
        if (!this.isRunning) return;
        
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = currentTime;
        
        // Update game logic
        this.update(deltaTime);
        
        // Schedule next tick
        this.intervalId = setTimeout(() => this._tick(), this.updateInterval);
    }
    
    // Update game logic (called every tick)
    update(deltaTime) {
        // Update world state
        if (this.gameState.world) {
            this.gameState.world.update(deltaTime);
        }
        
        // TODO: Update physics, entities, collisions, etc.
        // TODO: Update player positions, AI player positions, projectiles, etc.
        
        // Notify callbacks of update
        this.onUpdateCallbacks.forEach(callback => {
            callback(deltaTime, this.gameState.getStateSnapshot());
        });
    }
    
    // Register callback for game updates
    onUpdate(callback) {
        this.onUpdateCallbacks.push(callback);
    }
}

module.exports = GameLoop;
