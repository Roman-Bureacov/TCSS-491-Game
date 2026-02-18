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
    acceleration = {x:0, y: 0};

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
    velocityMax = {x: 5, y: 10};

    constructor() {

    }

    /**
     * Updates the physics of this entity
     * @param timeStep
     */
    updatePhysics(timeStep) {
        const newVelocityX = this.acceleration.x * timeStep;
        const newVelocityY = this.acceleration.y * timeStep;

        // find new velocity
        this.velocity.x += newVelocityX;
        this.velocity.y += newVelocityY;

        // clamp velocity down
        this.velocity.x =
            (Math.abs(this.velocity.x) > this.velocityMax.x) ?
            this.velocityMax.x * Math.sign(this.velocity.x)
            : this.velocity.x;
        this.velocity.y =
            (Math.abs(this.velocity.y) > this.velocityMax.y) ?
            this.velocityMax.y * Math.sign(this.velocity.y)
            : this.velocity.y;

        this.position.x += this.velocity.x * timeStep;
        this.position.y += this.velocity.y * timeStep;
    }
}

