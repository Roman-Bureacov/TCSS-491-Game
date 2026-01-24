/*
Represents an entity, which is drawable on the renderer
 */

import {Drawable} from "./render/Render.js";
import {PhysicsEntity} from "./character/PhysicsEntity.js";

/**
 * Represents a drawable entity for the renderer.
 *
 * This entity is capable of physics.
 *
 * @author Roman Bureacov
 */
export class Entity extends Drawable {

    /**
     * Represents the physics for this entity
     * @type {PhysicsEntity}
     */
    physics = new PhysicsEntity()

    /**
     * Constructs a new drawable physics entity
     * @param {Spritesheet} spritesheet the spritesheet
     */
    constructor(spritesheet) {
        super(spritesheet);
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
     */
    constructor(spritesheet) {
        super(spritesheet);
    }

    /**
     * Updates this static entity for the renderer
     */
    updateStatic() {
        this.matrix.set(0,3, this.position.x);
        this.matrix.set(1,3, this.position.y);
    }
}