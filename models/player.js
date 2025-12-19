// Player Model - Represents a player entity in the game

class Player {
    constructor(playerId, initialData = {}) {
        this.id = playerId;
        this.x = initialData.x || 0;
        this.y = initialData.y || 0;
        this.vx = initialData.vx || 0; // velocity x
        this.vy = initialData.vy || 0; // velocity y
        this.hoverMode = initialData.hoverMode || false;
        this.landingGear = initialData.landingGear || false;
        this.facingRight = initialData.facingRight || false;
        this.connected = true;
        this.lastUpdateTime = Date.now();
    }
    
    // Update player position
    updatePosition(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.lastUpdateTime = Date.now();
    }
    
    // Update player state
    updateState(state) {
        if (state.hoverMode !== undefined) this.hoverMode = state.hoverMode;
        if (state.landingGear !== undefined) this.landingGear = state.landingGear;
        if (state.facingRight !== undefined) this.facingRight = state.facingRight;
        this.lastUpdateTime = Date.now();
    }
    
    // Serialize player data for network transmission
    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            hoverMode: this.hoverMode,
            landingGear: this.landingGear,
            facingRight: this.facingRight
        };
    }
}

module.exports = Player;
