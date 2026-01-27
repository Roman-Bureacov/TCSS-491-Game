import { PhysicsEntity } from "./PhysicsEntity.js";
import { Animator } from "./animation.js";
import {Entity} from "../entity.js";

/**
 * Creates a basic character
 *
 * @author Roman Bureacov
 */
export class Character extends Entity {

    /**
     * The state of this character
     * @type {Object.<string, string>}
     */
    states = { };

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
     * @Type {string} the state name
     */
    state = "";

    /**
     * The facing of this character
     * @type {string} the facing name
     */
    facing = Character.DIRECTION.RIGHT;

    /**
     * Creates a basic character
     * @param {GameEngine} game the game engine
     * @param {Spritesheet} spritesheet the spritesheet for this character
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     */
    constructor(game, spritesheet, dimX = 1, dimY = 1) {
        super(spritesheet, dimX, dimY);
        Object.assign(this, { game });

    }

    /**
     * Sets up the animation for this sprite
     */
    setupAnimation() {
        // this.animations = { [name] : new Animator(...), ... }

        this.currentAnimation = this.animations[this.animationName()];
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
        // if dealing with acceleration, it may be useful to
        // always begin with an acceleration vector of 0

        // state checking here...

        let tick = this.game.clockTick
        this.updatePhysics(tick);

        let anim = this.animations[this.animationName()];
        // are we switching animations?
        if (anim !== this.currentAnimation) {
            this.currentAnimation = anim;
            this.currentAnimation.reset();
        }
        this.currentAnimation.update(tick);
        this.drawingProperties.row = this.currentAnimation.currentFrame.row;
        this.drawingProperties.col = this.currentAnimation.currentFrame.col;
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