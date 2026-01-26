/*
A concrete implementation of the character class
 */

import {Character} from "./character.js"
import {Spritesheet} from "./animation.js";
import {Animator} from "./animation.js";
import {KeyMapper} from "../../../keymapper.js";
import {global} from "../../../main.js";

export class AwesomeCharacter extends Character {
    constructor(game, image, startPosX, startPosY) {
        super(game, image);

        this.position.x  = startPosX;
        this.position.y = startPosY;

        this.spritesheet = new Spritesheet(image, 3, 14);

        this.states = Object.freeze({
            MOVE: "move ",
            ATTACK: "attack ",
            IDLE: "idle ",
        });
        
        this.position.x = 120;
        this.position.y = 13;

        this.state = this.states.IDLE;
        this.facing = Character.DIRECTION.RIGHT;

        this.velocityMax.x = 100;

        this.constantAcceleration = {
            [Character.DIRECTION.LEFT]: 0,
            [Character.DIRECTION.RIGHT]: 0,
        };
        this.lastState = this.state;

        this.setupAnimation();
        this.setupKeymap();
    }

    setupAnimation() {
        this.animations = {
            [this.states.MOVE + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
                1),
            [this.states.MOVE + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
                1
            ),
            [this.states.IDLE + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                [[0, 0]],
                1
            ),
            [this.states.IDLE + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [[0, 13]],
                1
            ),
            [this.states.ATTACK + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
                0.5,
                false,
                () => {
                    this.stateLock = false;
                    this.state = this.lastState;
                    this.facing = Character.DIRECTION.RIGHT;
                }
            ),
            [this.states.ATTACK + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [[2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7]],
                0.5,
                false,
                () => {
                    this.stateLock = false;
                    this.state = this.lastState;
                    this.facing = Character.DIRECTION.LEFT;
                }
            ),
        };

        this.currentAnimation = this.animations[this.animationName()];
    }

    setupKeymap() {
        this.keymapper = new KeyMapper();

        this.keymapper.inputMap = {
            [KeyMapper.getName("KeyD", true)]: "move right",
            [KeyMapper.getName("KeyA", true)]: "move left",
            [KeyMapper.getName("KeyS", true)]: "attack",
            [KeyMapper.getName("KeyD", false)]: "stop right",
            [KeyMapper.getName("KeyA", false)]: "stop left",
        };

        this.keymapper.outputMap = {
            "move right": () => this.move(150),
            "move left": () => this.move(-150),
            "attack": () => this.swing(),
            "stop right": () => this.stopMoving(Character.DIRECTION.RIGHT),
            "stop left": () => this.stopMoving(Character.DIRECTION.LEFT),
        };
    }

    /**
     * Sets the acceleration for this character
     * @param acceleration
     */
    move(acceleration) {
        if (!this.setState(this.states.MOVE)) {
            const newFacing = acceleration < 0 ? Character.DIRECTION.LEFT : Character.DIRECTION.RIGHT;
            if (newFacing !== this.facing) {
                this.velocity.x /= 2;
                this.facing = newFacing;
            }

            this.constantAcceleration[this.facing] = acceleration;

        }
    }

    /**
     * Removes acceleration in the facing direction
     * @param facing
     */
    stopMoving(facing) {
        this.constantAcceleration[facing] = 0;
    }

    /**
     * Initiates an attack
     */
    swing() {
        if (!this.stateLock) {
            this.lastState = this.state;
            this.state = this.states.ATTACK;
            this.stateLock = true;
        }
    }


    update() {
        super.update();
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        // hard-coded gobbledegook
        if (this.position.x > global.CANVAS_W - 20) this.position.x = -75;
        else if (this.position.x < -75) this.position.x = global.CANVAS_W - 20;

        ({
            [this.states.ATTACK]: () => {
                this.velocity.x /= 1.05;
            },
            [this.states.MOVE]: () => {
                this.acceleration.x =
                    this.constantAcceleration[Character.DIRECTION.LEFT]
                    + this.constantAcceleration[Character.DIRECTION.RIGHT];

                if (this.acceleration.x === 0) {
                    this.setState(this.states.IDLE);
                } else this.setState(this.states.MOVE);
            },
            [this.states.IDLE]: () => {
                this.velocity.x /= 1.05;
            }
        })[this.state]?.();

        switch (this.state) {
            case this.states.ATTACK:

        }

    }

}