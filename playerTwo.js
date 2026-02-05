/*
A concrete implementation of the character class
 */

import {Character} from "./character.js"
import {Animator} from "./animation.js";
import {KeyMapper} from "./keymapper.js";
import {global} from "./main.js";
import {characterFactory} from "./characterFactory.js";
import {SoundFX} from "./soundFX.js";
import {switchCharacters} from "./switchCharacters.js";
import {BoundingBox} from "./BoundingBox.js";

export class PlayerTwo extends Character {
    constructor(game, assetManager, characterName, startPosX, startPosY) {
        super(game, characterName);
        const character = new characterFactory(characterName, assetManager);
        this.position.x = startPosX;
        this.position.y = startPosY;


        this.character = new characterFactory(characterName, assetManager);
        this.spritesheet = character.getCharacterSpriteSheet();

        this.assetManager = assetManager;

        this.switchCharacter = new switchCharacters(this);

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
        this.updateBB();

        this.sound = new SoundFX({masterVolume: 0.8});
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
            [KeyMapper.getName("Numpad2", true)]: "switch character",
            [KeyMapper.getName("Digit2", true)]: "switch character",
        };

        this.keymapper.outputMap = {
            "move right": () => this.move(800),
            "move left": () => this.move(-800),
            "attack": () => this.swing(),
            "stop right": () => this.stopMoving(Character.DIRECTION.RIGHT),
            "stop left": () => this.stopMoving(Character.DIRECTION.LEFT),
            "switch character": () => this.switchCharacter.switchCharacter(),

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

            const p1 = this.game.playerOne;
            if (p1?.BB && this.BB.collide(p1.BB)) {


                console.log("Player two struck player one")
            }
        }
    }

    updateBB() {
        this.BB = new BoundingBox(this.position.x, this.position.y, this.character.getCharacter().frameWidth, this.character.getCharacter().frameHeight)
    };

    // helper
    landOnPlatform(entity, platformBB, oldY) {
        const bb = entity.BB;

        const oldBottom = oldY + bb.height;
        const newBottom = bb.y + bb.height;

        const platformTop = platformBB.y;

        const horizontallyOverlapping =
            bb.x < platformBB.x + platformBB.width &&
            bb.x + bb.width > platformBB.x;

        // falling and crossed platform top this frame
        if (horizontallyOverlapping &&
            entity.velocity.y >= 0 &&
            oldBottom <= platformTop &&
            newBottom >= platformTop) {

            entity.position.y = platformTop - bb.height; // snap to top
            entity.velocity.y = 0;
            entity.updateBB();
            return true;
        }

        return false;
    }

    update() {

        const oldX = this.position.x;
        const oldY = this.position.y;
        super.update();
        this.updateBB();
        const platforms = [
            this.game.platform1[0],
            this.game.platform2[0],
            this.game.platform3[0],
            this.game.platform4[0],
            this.game.platform5[0],
        ];

        let grounded = false;
        for (const p of platforms) {
            if (this.landOnPlatform(this, p, oldY)) {
                grounded = true;
                break;
            }
        }

        if (!grounded) {
            this.velocity.y += 5; // gravity
        }

        this.acceleration.x = 0;
        this.acceleration.y = 0;
        for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        // hard-coded gobbledegook
        if (this.position.x > global.CANVAS_W - 20) this.position.x = -75;
        else if (this.position.x < -75) this.position.x = global.CANVAS_W - 20;

        ({
            [this.states.ATTACK]: () => {
                this.velocity.x = 0;
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
                this.velocity.x = 0;
            }
        })[this.state]?.();

        switch (this.state) {
            case this.states.ATTACK:

        }
        this.updateBB();

        this.game.playerOne.updateBB?.();

        const p1 = this.game.playerOne;
        if (p1?.BB && this.BB.collide(p1.BB)) {
            const a = this.BB;
            const b = p1.BB;

            // overlap amount along x
            const overlapRight = (a.x + a.width) - b.x;       // a into b from left
            const overlapLeft = (b.x + b.width) - a.x;       // a into b from right

            // If player1 is left of player2, push left; else push right
            if (a.x < b.x) {
                this.position.x -= overlapRight;
            } else {
                this.position.x += overlapLeft;
            }

            this.velocity.x = 0;
            this.constantAcceleration[Character.DIRECTION.LEFT] = 0;
            this.constantAcceleration[Character.DIRECTION.RIGHT] = 0;

            this.updateBB();

        } else if (this.BB.collide(this.game.platform1[0]) || this.BB.collide(this.game.platform2[0])
            || this.BB.collide(this.game.platform3[0]) || this.BB.collide(this.game.platform4[0]) || this.BB.collide(this.game.platform5[0])) {

            // if (this.BB.collide(this.game.platform1[0])) {
            //     console.log(this.game.platform1[1])
            // } else if (this.BB.collide(this.game.platform2[0])) {
            //     console.log(this.game.platform2[1])
            //
            // } else if (this.BB.collide(this.game.platform3[0])) {
            //     console.log(this.game.platform3[1])
            //
            // } else if (this.BB.collide(this.game.platform4[0])) {
            //     console.log(this.game.platform4[1])
            //
            // } else if (this.BB.collide(this.game.platform5[0])) {
            //     console.log(this.game.platform5[1])
            //
            // }

            this.velocity.y = 0;
        } else {
            this.velocity.y += 5;
        }

    }

    getCurrentCharacter() {
        return this.character;
    }

    setNewCharacter(theNewCharacterData) {


        this.character = new characterFactory(theNewCharacterData.name, this.assetManager);
        this.game.playerTwo = this.character;

        this.spritesheet = this.character.getCharacterSpriteSheet();

        this.setupAnimation();

        this.currentAnimation = this.animations[this.animationName()];

        console.log("Player Two switched to:", this.character.getCharacter().name);
        this.game.playerTwo = this;
        this.game.platform1XR

    }

}