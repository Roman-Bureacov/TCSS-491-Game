import { PhysicsEntity } from "./PhysicsEntity.js";
import { Animator } from "./animation.js";

/**
 * Creates a basic character
 *
 * @author Roman Bureacov
 */
export class Character extends PhysicsEntity {

    /**
     * The scale of this character in the X and Y
     * @type {{x: number, y: number}}
     */
    scale = {x: 1, y: 1};

    /**
     * The state of this character
     * @type {Object.<string, string>}
     */
    states = {};

    /**
     * The map of animations for this character.
     * @type {{[p: string]: Animator}} the mapping of an animation name to its corresponding animator object
     */
    animations = { };

    /**
     * The current animator this character is using
     * @type {Animator}
     */
    currentAnimation = null;

    /**
     * If this character is locked from changing states
     * @type {boolean} if the character is allowed to change states
     */
    stateLock = false;

    /**
     * The map of direction constants to their respective strings
     * @type {Readonly<{UP: string, DOWN: string, LEFT: string, RIGHT: string}>}
     */
    static DIRECTION = Object.freeze({
        UP : "up ",
        DOWN : "down ",
        LEFT : "left ",
        RIGHT : "right ",
    });

    /**
     * The state of this character as per the states this character may exhibit.
     * @Type {string}
     */
    state = "";

    /**
     * The
     * @type {string}
     */
    facing = Character.DIRECTION.RIGHT;

    /**
     * The spritesheet object for this character
     * @type {Spritesheet}
     */
    Spritesheet = null;

    /**
     * Creates a basic character
     * @param game the game engine
     * @param characterName the spritesheet image for this character
     */
    constructor(game, characterName) {
        super();
        Object.assign(this, { game, characterName });

    }

    /**
     * Sets up the animation for this sprite
     */
    setupAnimation() {
        // this.animations = { [name] : new Animator(...), ... }

        this.currentAnimation = this.animations[this.animationName()];
    }

    /**
     * Draws this character
     * @param context the drawing context
     */
    draw(context) {
        let anim = this.animations[this.animationName()];

        // are we switching animations?
        if (anim !== this.currentAnimation) this.currentAnimation.reset();

        (this.currentAnimation = anim).draw(
            this.game.clockTick,
            context,
            this.position.x, this.position.y,
            this.scale.x, this.scale.y);
    }

    /**
     * Builds the animation name to retrieve
     * @returns {string}
     */
    animationName() {
        return this.state + this.facing;
    }

    /**
     * Updates this character
     */
    update() {
        this.updatePhysics(this.game.clockTick);
        // if dealing with acceleration, it may be useful to
        // always begin with an acceleration vector of 0

        // state checking here...
    }

    /**
     * Sets the state of this character if there is no state lock
     *
     * Intended to be used in the pattern:
     * ```JS
     * if (this.setState(new_state)) {
     *      ...
     * }
     * ```
     * @param newState the new state to go into
     * @return {boolean} the current state lock
     */
    setState(newState) {
        if (!this.stateLock) this.state = newState;
        return this.stateLock;
    }
}