import {Character} from "./character.js";
import {Animator, Spritesheet} from "./animation.js";
import {KeyMapper} from "../keymapper.js";
import { global } from "../main.js";

export class AwesomeCharacter extends Character {
    constructor(game, image) {
        super(game, image);

        this.spritesheet = new Spritesheet(this.image, 3, 14);

        this.states = Object.freeze({
            MOVE : "move ",
            ATTACK : "attack ",
            IDLE : "idle ",
        });

        this.state = this.states.IDLE;
        this.facing = Character.DIRECTION.RIGHT;

        this.velocityMax.x = 100;

        this.constantAcceleration = {
            [Character.DIRECTION.LEFT] : 0,
            [Character.DIRECTION.RIGHT] : 0,
        };
        this.lastState = this.state;

        this.setupAnimation();
        this.setupKeymap();
    }

    setupAnimation() {
        let attackAudioMap = { 2: global.assets.getAudio("sfx/swing.wav") };
        let walkingAudioMap = {
            0 : global.assets.getAudio("sfx/walk01.wav"),
            1 : global.assets.getAudio("sfx/walk02.wav"),
            2 : global.assets.getAudio("sfx/walk03.wav"),
            3 : global.assets.getAudio("sfx/walk04.wav"),
            4 : global.assets.getAudio("sfx/walk05.wav"),
            5 : global.assets.getAudio("sfx/walk06.wav"),
        }

        this.animations = {
            [this.states.MOVE + Character.DIRECTION.RIGHT] : new Animator(
                this.spritesheet,
                [ [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5] ],
                1,
                false,
                walkingAudioMap
            ),
            [this.states.MOVE + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [ [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5] ],
                // [ [1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8] ], // to make use of the old hard-coded frames
                1,
                true,
                walkingAudioMap
            ),
            [this.states.IDLE + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                [ [0, 0] ],
                1
            ),
            [this.states.IDLE + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [ [0, 13] ],
                1
            ),
            [this.states.ATTACK + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                [ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6] ],
                0.5,
                false,
                attackAudioMap,
                false,
                () => {
                    this.stateLock = false;
                    this.state = this.lastState;
                    this.facing = Character.DIRECTION.RIGHT;
                }
            ),
            [this.states.ATTACK + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [ [2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7] ],
                0.5,
                false,
                attackAudioMap,
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
            [KeyMapper.getName("KeyD", true)] : "move right",
            [KeyMapper.getName("KeyA", true)] : "move left",
            [KeyMapper.getName("KeyS", true)] : "attack",
            [KeyMapper.getName("KeyD", false)] : "stop right",
            [KeyMapper.getName("KeyA", false)] : "stop left",
        };

        this.keymapper.outputMap = {
            "move right" : () => this.move(150),
            "move left" : () => this.move(-150),
            "attack" : () => this.swing(),
            "stop right" : () => this.stopMoving(Character.DIRECTION.RIGHT),
            "stop left" : () => this.stopMoving(Character.DIRECTION.LEFT),
        };
    }

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

    stopMoving(facing) {
        this.constantAcceleration[facing] = 0;
    }

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
        if (this.position.x > 1000) this.position.x = -100;
        else if (this.position.x < -100) this.position.x = 1000;

        ({
            [this.states.ATTACK] : () => {
                this.velocity.x /= 1.05;
            },
            [this.states.MOVE] : () => {
                this.acceleration.x =
                    this.constantAcceleration[Character.DIRECTION.LEFT]
                    + this.constantAcceleration[Character.DIRECTION.RIGHT];

                if (this.acceleration.x === 0) {
                    this.setState(this.states.IDLE);
                } else this.setState(this.states.MOVE);
            },
            [this.states.IDLE] : () => {
                this.velocity.x /= 1.05;
            }
        })[this.state]?.();

        switch(this.state) {
            case this.states.ATTACK:

        }

    }

}