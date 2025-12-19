// AI Player Model - Represents an AI-controlled player entity in the game

class AIPlayer {
    constructor(aiPlayerId, initialData = {}) {
        this.id = aiPlayerId;
        this.x = initialData.x || 0;
        this.y = initialData.y || 0;
        this.vx = initialData.vx || 0; // velocity x
        this.vy = initialData.vy || 0; // velocity y
        this.hoverMode = initialData.hoverMode || false;
        this.landingGear = initialData.landingGear || false;
        this.facingRight = initialData.facingRight || false;
        this.type = initialData.type || 'default';
        this.health = initialData.health || 100;
        this.lastUpdateTime = Date.now();
    }
    
    // Update AI player position
    updatePosition(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.lastUpdateTime = Date.now();
    }
    
    // Update AI player state
    updateState(state) {
        if (state.hoverMode !== undefined) this.hoverMode = state.hoverMode;
        if (state.landingGear !== undefined) this.landingGear = state.landingGear;
        if (state.facingRight !== undefined) this.facingRight = state.facingRight;
        if (state.health !== undefined) this.health = state.health;
        if (state.type !== undefined) this.type = state.type;
        this.lastUpdateTime = Date.now();
    }
    
    // Serialize AI player data for network transmission
    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            hoverMode: this.hoverMode,
            landingGear: this.landingGear,
            facingRight: this.facingRight,
            type: this.type,
            health: this.health
        };
    }
}

module.exports = AIPlayer;
