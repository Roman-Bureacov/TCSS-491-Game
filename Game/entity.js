/*
Represents an entity, which is drawable on the renderer
 */

import {Drawable} from "./render/Render.js";
import {PhysicsEntity} from "./PhysicsEntity.js";

/**
 * Represents a drawable entity for the renderer.
 *
 * This entity is capable of physics.
 *
 * @author Roman Bureacov
 */
export class DynamicEntity extends Drawable {

    /**
     * Represents the physics for this entity
     * @type {PhysicsEntity}
     */
    physics = new PhysicsEntity()

    /**
     * Constructs a new drawable physics entity
     * @param {Spritesheet} spritesheet the spritesheet
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     * @param {number} [startX=0] The sprites starting x position
     * @param {number} [startY=0] The sprites starting y position
     */
    constructor(spritesheet, dimX = 1, dimY = 1, startX=0, startY=0) {
        super(spritesheet, dimX, dimY);
        this.physics.position.x = startX;
        this.physics.position.y = startY;
    }

    /**
     * Updates this entity's physics
     * @param {number} timestep the time step in seconds
     */
    updatePhysics(timestep) {
        this.physics.updatePhysics(timestep);

        this.matrix.set(0, 3, this.physics.position.x);
        this.matrix.set(1, 3, this.physics.position.y);
    }
}

/**
 * Represents a drawable entity for the renderer.
 *
 * This entity is not capable of physics.
 *
 * @author Roman Bureacov
 */
export class StaticEntity extends Drawable {

    /**
     * the position of this static entity
     * @type {{x: number, y: number}} the position
     */
    position = {
        x: 0, y: 0
    }

    /**
     * Constructs a new drawable static entity
     * @param {Spritesheet} spritesheet the spritesheet
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     * @param {boolean} isArena
     */
    constructor(spritesheet, dimX = 1, dimY = 1) {
        super(spritesheet, dimX, dimY);
    }

    /**
     * Updates this static entity for the renderer
     */
    updateStatic() {
        this.matrix.set(0,3, this.position.x);
        this.matrix.set(1,3, this.position.y);
    }
    
    
}


