/*
A concrete implementation of the character class
 */

import {Character} from "./character.js"
import {Animator} from "./animation.js";
import {KeyMapper} from "./keymapper.js";
import {global} from "./main.js";
import {characterFactory} from "./characterFactory.js";
import {SoundFX} from "./soundFX.js";

export class PlayerTwo extends Character {
    constructor(game, assetManager, characterName, startPosX, startPosY) {
        super(game, characterName);
        const character = new characterFactory(characterName, assetManager);
        this.position.x = startPosX;
        this.position.y = startPosY;
        this.character = new characterFactory(characterName, assetManager);
        this.spritesheet = character.getCharacterSpriteSheet();

        this.states = Object.freeze({
            MOVE: "move ",
            ATTACK: "attack ",
            IDLE: "idle ",
        });

        this.state = this.states.IDLE;
        this.facing = Character.DIRECTION.LEFT;

        this.velocityMax.x = 100;

        this.constantAcceleration = {
            [Character.DIRECTION.LEFT]: 0,
            [Character.DIRECTION.RIGHT]: 0,
        };
        this.lastState = this.state;

        this.setupAnimation();
        this.setupKeymap();
        this.sound = new SoundFX({masterVolume:0.8});
    }

    setupAnimation() {
      const moveR = this.character.getCharacter().moveR;
        const moveL = this.character.getCharacter().moveL;
        const movePad = this.character.getCharacter().movePadY;
        const idleR = this.character.getCharacter().idleR;
        const idleL = this.character.getCharacter().idleL;
        const idlePad = this.character.getCharacter().idlePadY;
        const attackR = this.character.getCharacter().attackR;
        const attackL = this.character.getCharacter().attackL;
        const attackPad = this.character.getCharacter().attackPadY;
        const idleDur = this.character.getCharacter().idleDur;
        const attackDur = this.character.getCharacter().attackDur;
        const moveDur = this.character.getCharacter().moveDur;
               const scale = this.character.getCharacter().scale;
        console.log(idlePad)
        this.animations = {
            [this.states.MOVE + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                movePad,
                scale,
                moveR, 
                moveDur),
            [this.states.MOVE + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                movePad,
                scale,
                moveL,
                moveDur),

            [this.states.IDLE + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                idlePad,
                scale,
                idleR,
                idleDur
            ),
            [this.states.IDLE + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                idlePad,
                scale,
                idleL,
                idleDur
            ),
            [this.states.ATTACK + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                attackPad,
                scale,
                attackR,
                attackDur,
                false,
                () => {
                    this.stateLock = false;
                    this.state = this.lastState;
                    this.facing = Character.DIRECTION.RIGHT;
                }
            ),
            [this.states.ATTACK + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                attackPad,
                scale,
                attackL,
                attackDur,
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
            [KeyMapper.getName("ArrowRight", true)]: "move right",
            [KeyMapper.getName("ArrowLeft", true)]: "move left",
            [KeyMapper.getName("ArrowDown", true)]: "attack",
            [KeyMapper.getName("ArrowRight", false)]: "stop right",
            [KeyMapper.getName("ArrowLeft", false)]: "stop left",
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
            this.sound.play(this.character.getCharacter().swordSound)
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