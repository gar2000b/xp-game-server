// Game World Model - Represents the game world/level state

class GameWorld {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.bounds = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
        this.gravity = 9.81; // Default gravity
        this.time = 0; // Game time
    }
    
    // Initialize world
    initialize(width, height) {
        this.width = width;
        this.height = height;
        this.bounds = {
            left: 0,
            right: width,
            top: 0,
            bottom: height
        };
    }
    
    // Update world state
    update(deltaTime) {
        this.time += deltaTime;
        // TODO: Update world state (spawn enemies, update environment, etc.)
    }
    
    // Check if position is within world bounds
    isWithinBounds(x, y) {
        return x >= this.bounds.left && 
               x <= this.bounds.right && 
               y >= this.bounds.top && 
               y <= this.bounds.bottom;
    }
    
    // Clamp position to world bounds
    clampToBounds(x, y) {
        return {
            x: Math.max(this.bounds.left, Math.min(this.bounds.right, x)),
            y: Math.max(this.bounds.top, Math.min(this.bounds.bottom, y))
        };
    }
    
    // Serialize world data for network transmission
    serialize() {
        return {
            width: this.width,
            height: this.height,
            bounds: this.bounds,
            gravity: this.gravity,
            time: this.time
        };
    }
}

module.exports = GameWorld;
