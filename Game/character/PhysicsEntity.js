/*
Some physics code

Roman Bureacov
 */

/**
 * A physics entity to be used by the physics engine
 *
 * @author Roman Bureacov
 */
export class PhysicsEntity {

    /**
     * The acceleration vector of this entity
     * @type {{x: number, y: number}}
     */
    acceleration = {x: 0, y: 0};

    /**
     * The velocity vector of this entity
     * @type {{x: number, y: number}}
     */
    velocity = {x: 0, y: 0};

    /**
     * The position of this entity
     * @type {{x: number, y: number}}
     */
    position = {x: 0, y: 0};

    /**
     * The absolute maximum velocity vector for this entity
     * @type {{x: number, y: number}}
     */
    velocityMax = {x: 1, y: 1};

    constructor() {

    }

    /**
     * Updates the physics of this entity
     * @param timeStep
     */
    updatePhysics(timeStep) {

        const newVelocityX = this.acceleration.x * timeStep;
        const newVelocityY = this.acceleration.y * timeStep;

        this.velocity.x +=
            (Math.abs(newVelocityX) > this.velocityMax.x) ?
                this.velocityMax.x * Math.sign(this.velocity.x)
                : newVelocityX;
        this.velocity.y +=
            (Math.abs(newVelocityY) > this.velocityMax.y) ?
                this.velocityMax.y * Math.sign(this.velocity.y)
                : newVelocityY;

        this.position.x += this.velocity.x * timeStep;
        this.position.y += this.velocity.y * timeStep;
    }
}

