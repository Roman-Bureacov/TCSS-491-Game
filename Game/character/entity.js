/*
Represents an entity, which is drawable on the renderer
 */

import {Drawable} from "../engine/render/Render.js";
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
     * Sets the position for this space object
     * @param {number} x the x position
     * @param {number} y the y position
     * @param {number} [z=0] the z position
     */
    setPosition(x, y, z=0) {
        this.physics.position.x = x;
        this.physics.position.y = y;
    }

    /**
     * Updates this entity's physics
     * @param {number} timestep the time step in seconds
     */
    updatePhysics(timestep) {
        this.physics.updatePhysics(timestep);

        super.setObjectPosition(
            this.physics.position.x,
            this.physics.position.y,
            0
        );
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
     * Constructs a new drawable static entity
     * @param {Spritesheet} spritesheet the spritesheet
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     */
    constructor(spritesheet, dimX = 1, dimY = 1) {
        super(spritesheet, dimX, dimY);
    }


    
}


