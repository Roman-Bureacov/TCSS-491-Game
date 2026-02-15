/*
A concrete implementation of the character class
 */

import {Character} from "./character.js"
import {Animator, Spritesheet} from "./animation.js";
import {KeyMapper} from "../engine/keymapper.js";
import {global} from "../main.js";
import {CharacterFactory} from "./characterFactory.js";
import {SoundFX} from "../engine/soundFX.js";
import {Hitbox, HitboxOp} from "../engine/hitbox.js";
import {TileEntity} from "./tileEntity.js";
import {Rectangle2D} from "../engine/primitives.js";

/**
 * Enum representing the possible states of player characters
 * @readonly
 * @enum {string}
 */
export const PlayerStates = Object.freeze({
    MOVE: "move ",
    ATTACK: "attack ",
    IDLE: "idle ",
});

/**
 * Concrete implementation of the character.
 *
 * @author Roman Bureacov
 */
export class Player extends Character {

    /**
     * The states that this player may exhibit
     * @type {Readonly<{MOVE: string, ATTACK: string, IDLE: string}>}
     */
    static states = PlayerStates;

    /**
     * The keymapper for this player
     * @type {KeyMapper}
     */
    keymapper;

    /**
     * Constructs a new playable character with no animators and an empty input map.
     *
     * @param {GameEngine} game the game
     * @param {Spritesheet} spritesheet the spritesheet representing this character
     * @param {number} dimX the positive dimension of this character
     * @param {number} dimY the positive dimension of this character
     * @param {number} [startX=0] the starting x position
     * @param {number} [startY=0] the starting y position
     */
    constructor(game, spritesheet,
                dimX = 1, dimY = 1,
                startX = 0, startY = 0) {
        super(game, spritesheet, dimX, dimY, startX, startY);

        this.state = Player.states.IDLE;
        this.facing = Character.DIRECTION.RIGHT;

        this.physics.velocityMax.x = 10;

        this.constantAcceleration = {
            [Character.DIRECTION.LEFT]: 0,
            [Character.DIRECTION.RIGHT]: 0,
        };
        this.lastState = this.state;

        this.initKeymap();
        this.initHitbox();

        // this.playSound = new SoundFX({masterVolume: 0.8});
    }

    initKeymap() {
        this.keymapper = new KeyMapper();
        this.keymapper.outputMap = {
            "move right": () => this.move(800),
            "move left": () => this.move(-800),
            "attack": () => this.swing(),
            "stop right": () => this.stopMoving(Character.DIRECTION.RIGHT),
            "stop left": () => this.stopMoving(Character.DIRECTION.LEFT),
        };
    };

    initHitbox() {
        let box = this.drawingProperties.bounds;
        this.hitbox = new Hitbox(
            this,
            new Rectangle2D(
                box.start.x(), box.start.y(),
                box.dimension.width, box.dimension.height
            )
        );
        this.hitbox.resolveIntersection = (properties) => {
            if (properties.other.parent === this) {
                return;
            } else if (properties.other.parent instanceof TileEntity) {
                HitboxOp.separate(properties);
                this.physics.position.x = this.objectX();
                this.physics.position.y = this.objectY();
                // console.log(this.physics.position)
            }
        }
    }

    /**
     * Sets the acceleration for this character
     * @param acceleration
     */
    move(acceleration) {
        if (!this.setState(Player.states.MOVE)) {
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

    /**
     * Initiates an attack
     */
    swing() {
        if (!this.stateLock) {
            console.log("swing");
            this.lastState = this.state;
            this.state = Player.states.ATTACK;
            this.stateLock = true;
            // this.playSound.play(this.character.swordSound)
        }

    }


    update() {
        this.physics.acceleration.x = 0;
        this.physics.acceleration.y = -0.1;

        for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        // hard-coded gobbledegook
        // if ( this.physics.position.x > global.CANVAS_W - 20)  this.physics.position.x = -75;
        // else if ( this.physics.position.x < -75)  this.physics.position.x = global.CANVAS_W - 20;

        switch (this.state) {
            case Player.states.ATTACK :
                this.physics.velocity.x = 0;
                break;
            case Player.states.MOVE :
                this.physics.acceleration.x =
                    this.constantAcceleration[Character.DIRECTION.LEFT]
                    + this.constantAcceleration[Character.DIRECTION.RIGHT];

                if (this.physics.acceleration.x === 0) {
                    this.setState(Player.states.IDLE);
                } else this.setState(Player.states.MOVE);
                break;
            case Player.states.IDLE :
                this.physics.velocity.x = 0;
                break;
        }

        super.update();
    }

}