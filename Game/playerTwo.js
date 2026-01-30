/*
A concrete implementation of the character class
 */

/*
A concrete implementation of the character class
 */

import {Character} from "./character/character.js"
import {Animator, Spritesheet} from "./character/animation.js";
import {KeyMapper} from "./engine/keymapper.js";
import {global} from "./main.js";
import {CharacterFactory} from "./character/characterFactory.js";
import {SoundFX} from "./engine/soundFX.js";

/**
 * @deprecated
 */
export class PlayerTwo extends Character {
    constructor(game, assetManager, characterName, startPosX, startPosY) {

        const character = new CharacterFactory(characterName, assetManager);
        const sprite = character.getCharacterSpriteSheet();
        super(game, sprite, 200,400 , startPosX, startPosY);

        this.character = character.getCharacter();
        this.sprite = character.getCharacterSpriteSheet();

        this.states = Object.freeze({
            MOVE: "move ",
            ATTACK: "attack ",
            IDLE: "idle ",
        });
        
        this.matrix.set(1,2, startPosX);
        this.matrix.set(2,2, startPosY);

        this.physics.position.x = startPosX;
        this.physics.position.y = startPosY;

        this.state = this.states.IDLE;
        this.facing = Character.DIRECTION.LEFT;

         this.physics.velocityMax.x = 100;

        this.constantAcceleration = {
            [Character.DIRECTION.LEFT]: 0,
            [Character.DIRECTION.RIGHT]: 0,
        };
        this.lastState = this.state;

        this.setupAnimation();
        this.setupKeymap();

        this.playSound = new SoundFX({masterVolume: 0.8});
    }

    setupAnimation() {
        const moveR = this.character.moveR;
        const moveL = this.character.moveL;
        const movePad = this.character.movePadY;
        const idleR = this.character.idleR;
        const idleL = this.character.idleL;
        const idlePad = this.character.idlePadY;
        const attackR = this.character.attackR;
        const attackL = this.character.attackL;
        const attackPad = this.character.attackPadY;
        const idleDur = this.character.idleDur;
        const attackDur = this.character.attackDur;
        const moveDur = this.character.moveDur;
        const scale = this.character.scale;

        this.animations = {
            [this.states.MOVE + Character.DIRECTION.RIGHT]: new Animator(
                this.sprite,
                movePad,
                scale,
                moveR,
                moveDur),
            [this.states.MOVE + Character.DIRECTION.LEFT]: new Animator(
                this.sprite,
                movePad,
                scale,
                moveL,
                moveDur),

            [this.states.IDLE + Character.DIRECTION.RIGHT]: new Animator(
                this.sprite,
                idlePad,
                scale,
                idleR,
                idleDur
            ),
            [this.states.IDLE + Character.DIRECTION.LEFT]: new Animator(
                this.sprite,
                idlePad,
                scale,
                idleL,
                idleDur
            ),
            [this.states.ATTACK + Character.DIRECTION.RIGHT]: new Animator(
                this.sprite,
                attackPad,
                scale,
                attackR,
                attackDur,
                false,
                false,
                
                () => {
                    this.stateLock = false;
                    this.state = this.lastState;
                    this.facing = Character.DIRECTION.RIGHT;
                }
            ),
            [this.states.ATTACK + Character.DIRECTION.LEFT]: new Animator(
                this.sprite,
                attackPad,
                scale,
                attackL,
                attackDur,
                false,
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
            "move right": () => this.move(800),
            "move left": () => this.move(-800),
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
                 this.physics.velocity.x = 0;
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
    num = 0;
    /**
     * Initiates an attack
     */
    swing() {
        if (!this.stateLock) {
            console.log("swing");
            this.lastState = this.state;
            this.state = this.states.ATTACK;
            this.stateLock = true;
            this.playSound.play(this.character.swordSound)

        }

    }


    update() {
        super.update();
        
        this.physics.acceleration.x = 0;
        this.physics.acceleration.y = 0;
        
        for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        // hard-coded gobbledegook
        if ( this.physics.position.x > global.CANVAS_W - 20)  this.physics.position.x = -75;
        else if ( this.physics.position.x < -75)  this.physics.position.x = global.CANVAS_W - 20;

        ({
            [this.states.ATTACK]: () => {
                 this.physics.velocity.x = 0;
            },
            [this.states.MOVE]: () => {
                 this.physics.acceleration.x =
                    this.constantAcceleration[Character.DIRECTION.LEFT]
                    + this.constantAcceleration[Character.DIRECTION.RIGHT];

                if ( this.physics.acceleration.x === 0) {
                    this.setState(this.states.IDLE);
                } else this.setState(this.states.MOVE);
            },
            [this.states.IDLE]: () => {
                this.physics.velocity.x = 0;
            }
        })[this.state]?.();

        switch (this.state) {
            case this.states.ATTACK:

        }


    }

}




