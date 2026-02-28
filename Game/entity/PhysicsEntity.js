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
     * The precision for physics, to prevent
     * numbers continuously growing smaller and instead
     * rounding down to zero.
     * @type {number}
     */
    static PRECISION = 10e-2;

    /**
     * The acceleration vector of this entity in meters per second per second
     * @type {{x: number, y: number}}
     */
    acceleration = {x:0, y: 0};

    /**
     * The velocity vector of this entity in meters per second
     * @type {{x: number, y: number}}
     */
    velocity = {x: 0, y: 0};

    /**
     * The position of this entity in meters
     * @type {{x: number, y: number}}
     */
    position = {x: 0, y: 0};

    /**
     * The absolute maximum velocity vector for this entity in meters per second
     * @type {{x: number, y: number}}
     */
    velocityMax = {x: 1, y: 1};

    /**
     * The amount of drag for this entity, measured in
     * @type {{x: number, y: number}}
     */
    drag = {x: 0, y: 0}

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

    /**
     * Calculates the deceleration vector based on this entity's drag
     * @return {{x: number, y: number}} the deceleration vector, in meters per second per second
     */
    getDecelerationVector() {
        const oppSignX = -Math.sign(this.velocity.x);
        const oppSignY = -Math.sign(this.velocity.y);

        return {
            x: Math.floor(
                    (1 / 2 * oppSignX * this.drag.x * this.velocity.x ** 2)
                    / PhysicsEntity.PRECISION
                ) * PhysicsEntity.PRECISION,
            y: Math.floor(
                (1/2 * oppSignY * this.drag.y * this.velocity.y ** 2)
                / PhysicsEntity.PRECISION
            ) * PhysicsEntity.PRECISION
        }
    }
}

