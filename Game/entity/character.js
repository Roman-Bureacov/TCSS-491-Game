import {Animator, Spritesheet} from "./animation.js";
import {DynamicEntity} from "./entity.js";
import {DIRECTIONS} from "../engine/constants.js";




/**
 * Creates a basic character
 *
 * @author Roman Bureacov
 */
export class Character extends DynamicEntity {

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
    animations = {};

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

    static DIRECTION = CharacterDirections;

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
     * Creates a basic character
     * @param {GameEngine} game the game engine
     * @param  {Spritesheet} spritesheet the character spritesheet
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     * @param {number} [startX=0] the start x position
     * @param {number} [startY=0] the start y position
     */
    constructor(game, spritesheet,
                dimX = 1, dimY = 1,
                startX = 0, startY = 0) {
        super(spritesheet, dimX, dimY, startX, startY);
        Object.assign(this, {game});

    }

    /**
     * Sets up the animation for this sprite
     */
    setupAnimation() {
        // this.animations = { [name] : new Animator(...), ... }

        this.currentAnimation = this.animations[this.animationName()];
    }


    /**
     * updates this character
     */
    update() {
        // let anim = this.animations[this.animationName()];
        //
        // // are we switching animations?
        // if (anim !== this.currentAnimation) this.currentAnimation.reset();
        //
        // (this.currentAnimation = anim).update(
        //     this.game.clockTick)

        let tick = this.game.clockTick
        this.updatePhysics(tick);

        let anim = this.animations[this.animationName()];
        // are we switching animations?
        if (!anim) return; // no animation for this state+facing

        if (anim !== this.currentAnimation) {
            if (this.currentAnimation) this.currentAnimation.reset();
            this.currentAnimation = anim;
            if (this.currentAnimation) this.currentAnimation.reset();

        }
        this.currentAnimation.update(tick);
        this.drawingProperties.spriteRow = this.currentAnimation.currentFrame.row;
        this.drawingProperties.spriteCol = this.currentAnimation.currentFrame.col;
        this.drawingProperties.isReversed = this.currentAnimation.reversed;
    }

    /**
     * Builds the current animation name to retrieve
     * @returns {string} the animation name
     */
    animationName() {
        return this.state + this.facing;
    }

    /**
     * Builds a valid animation name
     * @param {string} state the state
     * @param {string} facing the facing
     * @return {string} the animation name
     */
    static buildAnimationName(state, facing) {
        return state + facing;
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