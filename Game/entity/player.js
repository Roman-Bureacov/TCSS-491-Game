/*
A concrete implementation of the character class
 */

import {Character} from "./character.js"
import {Spritesheet} from "./animation.js";
import {KeyMapper} from "../engine/keymapper.js";
import {Hitbox, HITBOX_TYPE, HitboxOp} from "../engine/hitbox.js";
import {TileEntity} from "./tileEntity.js";
import {Rectangle2D} from "../engine/primitives.js";
import {SoundFX} from "../engine/soundFX.js";
import {DIRECTIONS} from "../engine/constants.js";

/**
 * The collection of vitality statistics
 * @typedef VitalityStats
 * @property {number} health the amount of health remaining
 * @property {number} posture the amount of posture gained
 * @property {number} souls the amount of souls remaining
 */

/**
 * The collection of sound effects that the player can fire
 * @typedef SoundEvents
 * @property {() => {}} playHitSound the sound effect when the player is hit
 * @property {() => {}} playDeadSound the sound effect when the player dies
 * @property {() => {}} playSwingSound the sound effect when the player swings their weapon
 */

/**
 * Concrete implementation of the character.
 *
 * @author Roman Bureacov
 */
export class Player extends Character {

    /**
     * The possible properties to listen on
     * @enum {string}
     */
    static PROPERTIES = Object.freeze({
        /** the player health has changed, sends old health as then and new health as now */
        HEALTH: "Player.HEALTH",
        /** the player posture has changed, the old posture as then and new posture as now */
        POSTURE: "Player.POSTURE",
        /** the player souls has changed, the old souls as then and the new souls as now */
        SOULS: "Player.SOULS",
        /** the player has died, does not send anything */
        DIED: "Player.DIED",
        /** the player has maximized their posture, does not send anything */
        MAX_POSTURE: "Player.MAX_POSTURE",
    })

    /**
     * Collection of constants pertaining to the player
     * @readonly
     */
    static CONSTANTS = Object.freeze({
        VITALITY_MAXIMUMS: {
            health: 100,
            posture: 100,
            souls: 3
        },
        POSTURE_DRAIN_PER_SECOND: 10,
        POSTURE_PER_DAMAGE: 3,
        POSTURE_TIMEOUT: 5,
        KNOCKBACK: {
            CLASH: {x: 5, y: 5},
            SUCCESSFUL_BLOCK: {x: 10, y: 3},
            FAIR_BLOCK: {x: 5, y: 3},
            POOR_BLOCK: {x: 3, y: 3},
            HIT: {x: 3, y: 3},
        }
    });

    /**
     * Enum representing the possible states of player characters
     * @readonly
     * @enum {string}
     */
    static states = Object.freeze({
        MOVE: "move ",
        ATTACK: "attack ",
        IDLE: "idle ",
        JUMP: "jump",
        DEAD: "dead",
        STAGGERED: "staggered"
    });

    /**
     * The sound effects for this payer
     * @type {SoundEvents}
     */
    soundEvents = {
        playHitSound : () => {},
        playDeadSound : () => {},
        playSwingSound : () => {},
    }

    /**
     * The keymapper for this player
     * @type {KeyMapper}
     */
    keymapper;

    /**
     * If this character is on the ground
     * @type {boolean}
     */
    onGround = false;

    /**
     * The vitality stats of this player.
     * @type {VitalityStats}
     */
    vitality = {
        health: 0,
        posture: 0,
        souls: 0,
    }

    /**
     * The amount of time remaining in the stagger state
     * @type {number} the time in seconds
     */
    staggerTimeout = 0;

    /**
     * The finisher hitbox for this player
     * @type {Hitbox}
     */
    finisherHitbox;

    /**
     * Collection of setters for this object.
     */
    setters = {
        /**
         * Sets the health for this player
         *
         * If the new health is below the minimum or
         * above the maximum, then it is either the minimum
         * or maximum that is set.
         *
         * @param {number} newHealth the new health to set
         */
        health : (newHealth) => {
            newHealth = Math.max( // bounds check on health
                0,
                Math.min(
                    newHealth,
                    Player.CONSTANTS.VITALITY_MAXIMUMS.health
                )
            );

            // only change and notify if there is a difference
            if (this.vitality.health - newHealth) {
                this.notifyListeners(Player.PROPERTIES.HEALTH,
                    this.vitality.health,
                    this.vitality.health = newHealth
                );
            }

        },

        /**
         * Sets the posture for this player.
         *
         * If the new posture is below the minimum or
         * above the maximum, then it is either the minimum
         * or the maximum that is set.
         *
         * @param {number} newPosture
         */
        posture : (newPosture) => {
            newPosture = Math.max( // bounds check
                0,
                Math.min(
                    newPosture,
                    Player.CONSTANTS.VITALITY_MAXIMUMS.posture
                )
            );

            // only change and notify if there is a difference
            if (this.vitality.posture - newPosture) {
                this.notifyListeners(Player.PROPERTIES.POSTURE,
                    this.vitality.posture,
                    this.vitality.posture = newPosture
                );
            }

            // initiate staggered state when we max out posture
            if (newPosture === Player.CONSTANTS.VITALITY_MAXIMUMS.posture) {
                this.stagger();
            }
        },

        /**
         * Sets the souls for this player
         *
         * If the new souls is below the minimum or
         * above the maximum, then it is either the minimum
         * or the maximum that is set
         *
         * @param {number} newSouls
         */
        souls : (newSouls) => {
            newSouls = Math.max( // bounds check on health
                0,
                Math.min(
                    newSouls,
                    Player.CONSTANTS.VITALITY_MAXIMUMS.souls
                )
            );

            // only change and notify if there is a difference
            if (this.vitality.souls - newSouls) {
                this.notifyListeners(Player.PROPERTIES.SOULS,
                    this.vitality.souls,
                    this.vitality.souls = newSouls
                );
            }

            if (newSouls <= 0) {
                this.kill();
            }
        }
    }

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

        this.vitality.health = Player.CONSTANTS.VITALITY_MAXIMUMS.health;
        this.vitality.souls = Player.CONSTANTS.VITALITY_MAXIMUMS.souls;

        // phys init
        this.constantVelocity = {
            [DIRECTIONS.LEFT]: 0,
            [DIRECTIONS.RIGHT]: 0,
        };
        this.physics.velocityMax.x = 50;
        this.physics.velocityMax.y = 10;
        this.physics.accelerationMax.x = 10;
        this.physics.accelerationMax.y = 10;
        this.physics.drag.x = 15;
        this.physics.drag.y = 0;

        this.state = Player.states.IDLE;
        this.lastState = this.state;

        this.gravity = -20;

        this.initKeymap();
        this.initSelfHitbox();
        this.initAttackHitbox();
        this.initFinisherHitbox();
    }

    // SECTION: initializers

    /**
     * Sets up the players attack and body hitboxes, adds it to the game engine. Sets the dynamic hitboxes.
     */
    initAttackHitbox() {
        this.attackHitbox = new AttackHitbox(this, new Rectangle2D(
            0, -this.hitbox.bounds.dimension.height * 0.1,
            .05, this.hitbox.bounds.dimension.height * 0.9
        ));
    }

    /**
     * Reinitializes this player.
     */
    reinit() {
        this.stateLock = false;
        this.state = Player.states.IDLE;
        this.vitality.health = Player.CONSTANTS.VITALITY_MAXIMUMS.health;
        this.vitality.posture = 0;
        this.vitality.souls = Player.CONSTANTS.VITALITY_MAXIMUMS.souls;
    }

    initKeymap() {
        this.keymapper = new KeyMapper();
        this.keymapper.outputMap = {
            "move right": () => this.move(5),
            "move left": () => this.move(-5),
            "attack": () => this.swing(),
            "stop right": () => this.stopMoving(DIRECTIONS.RIGHT),
            "stop left": () => this.stopMoving(DIRECTIONS.LEFT),
            "jump": () => this.jump(),
            "finisher": () => this.finisher()
        };
    };

    initSelfHitbox() {

        let box = this.drawingProperties.bounds;
        this.hitbox = new Hitbox(
            this,
            new Rectangle2D(
                box.start.x(), box.start.y(),
                box.dimension.width, box.dimension.height
            )
        );
        this.hitbox.kind = HITBOX_TYPE.BODY;

        this.hitbox.resolveIntersection = (properties) => {
            if (properties.other.parent === this) {
                return;
            } else if (properties.other.parent instanceof TileEntity) {
                HitboxOp.separate(properties); // repositions object origin
                if (this.objectY() - this.physics.position.y > 0) {
                    // this entity was push up, therefore we must be on the ground
                    this.onGround = true;
                    this.physics.velocity.y = Math.max(0, this.physics.velocity.y);
                }
                if (this.objectY() - this.physics.position.y > 0) {
                    this.onGround = true;

                    //if we were jumping, unlock and return to idle/move
                    if (this.state === Player.states.JUMP) {
                        this.stateLock = false;

                        const ax =
                            this.constantVelocity[DIRECTIONS.LEFT] +
                            this.constantVelocity[DIRECTIONS.RIGHT];

                        this.state = (ax !== 0) ? Player.states.MOVE : Player.states.IDLE;
                    }
                }

                this.physics.position.x = this.objectX();
                this.physics.position.y = this.objectY();
            }
        }
    }

    /**
     * Initializes the finisher hitbox
     */
    initFinisherHitbox() {
        this.finisherHitbox = new FinisherHitbox(
            this,
            new Rectangle2D(
                0, 0,
                this.attackHitbox.bounds.dimension.width,
                this.attackHitbox.bounds.dimension.height
                )
        )
    }

    // SECTION: actions that may be performed on the player

    /**
     * Initiates a hit on this player, launching any necessary
     * events as a result.
     *
     * @param {number} damage the amount of damage this player should take
     */
    hit(damage) {
        console.log("Taking damage...")

        const newHealth = this.vitality.health - damage;
        this.setters.health(newHealth);

        if (this.state !== Player.states.STAGGERED) {
            const newPosture = this.vitality.posture + damage * Player.CONSTANTS.POSTURE_PER_DAMAGE;
            this.setters.posture(newPosture);
        }

        this.soundEvents.playHitSound();
    }

    /**
     * Initiates the event that this player has died.
     */
    kill() {
        this.stateLock = true;
        this.state = Player.states.DEAD;
        this.soundEvents.playDeadSound();

        this.notifyListeners(Player.PROPERTIES.DIED);
    }

    /**
     * Initiates the event that this player is staggered
     */
    stagger() {
        console.log("I've been staggered!")
        this.state = Player.states.STAGGERED;
        this.stateLock = true;
        this.staggerTimeout = Player.CONSTANTS.POSTURE_TIMEOUT;
        // deactivate relevant hitboxes
        this.attackHitbox.expired = true;
        this.finisherHitbox.expired = true;
    }

    /**
     * Initiates the event that this player has had a finisher
     * performed on them
     */
    finish() {
        console.log("I've been finished upon!")
        this.state = Player.states.IDLE;
        this.stateLock = false;
        this.setters.souls(this.vitality.souls - 1);
        if (this.vitality.souls > 0) {
            this.setters.posture(0);
            this.setters.health(Player.CONSTANTS.VITALITY_MAXIMUMS.health);
        }
    }

    /**
     * pushes the player in a direction
     *
     * @param {number} velocityX the push velocity in X
     * @param {number} velocityY the push velocity in Y
     */
    push(velocityX, velocityY) {
        this.constantVelocity[DIRECTIONS.LEFT] = 0;
        this.constantVelocity[DIRECTIONS.RIGHT] = 0;

        this.physics.velocity.x = velocityX;
        this.physics.velocity.y = velocityY;
    }

    /**
     * Knocks the player back, in the opposite direction they are facing.
     * @param {number} velocityX the unsigned amount of knockback in the x
     * @param {number} velocityY the signed amount of knockback in the y
     */
    knockback(velocityX, velocityY) {

        if (this.facing === DIRECTIONS.RIGHT) {
            velocityX = -velocityX;
        }

        this.push(velocityX, velocityY)
    }

    // SECTION: functions that map directly to player output map

    /**
     * Sets the acceleration for this character
     * @param {number} velocityX
     */
    move(velocityX) {
        if (!this.setState(Player.states.MOVE)) {
            const newFacing = velocityX < 0 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
            if (newFacing !== this.facing) {
                this.physics.velocity.x = 0;
                this.facing = newFacing;
            }

            this.constantVelocity[this.facing] = velocityX;

        }

    }

    /**
     * Removes acceleration in the facing direction
     * @param facing
     */
    stopMoving(facing) {
        this.constantVelocity[facing] = 0;
    }

    /**
     * Initiates an attack
     */
    swing() {
        if (this.stateLock) return;

        this.lastState = this.state;
        this.state = Player.states.ATTACK;
        this.stateLock = true;

        this.updateAttackHitboxBounds();
        this.game.spawnDynamicHitbox(this.attackHitbox);
        this.finisherHitbox.expired = true;

        this.soundEvents.playSwingSound();
    }


    /**
     * causes this player to jump
     */
    jump() {
        if (!this.stateLock) {
            if (this.onGround) {
                this.onGround = false;
                this.physics.velocity.y = -this.gravity/3;
            }
        }
    }

    /**
     * causes a player to initiate a finisher
     */
    finisher() {
        if (this.stateLock) return;

        // spawn at where the player is looking
        const hw = this.finisherHitbox.bounds.dimension.width
        if (this.facing === DIRECTIONS.LEFT) {
            this.finisherHitbox.bounds.setStart(
                -hw,
                this.finisherHitbox.bounds.start.y()
            )
        } else {
            const w = this.hitbox.bounds.dimension.width;
            this.finisherHitbox.bounds.setStart(
                w,
                this.finisherHitbox.bounds.start.y()
            )
        }

        this.game.spawnDynamicHitbox(this.finisherHitbox);
    }

    // SECTION: overrides

    update() {
        const drag = this.physics.getDragVector()
        this.physics.acceleration.y = this.gravity + drag.y;
        this.physics.acceleration.x = drag.x;

        // send the keys for this player to process
        for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        // natural drain of the posture
        if (this.state !== Player.states.STAGGERED) {
            this.setters.posture(
                this.vitality.posture - Player.CONSTANTS.POSTURE_DRAIN_PER_SECOND * this.game.clockTick
            )
        }

        // to prevent endless deceleration that only gets smaller but does not equal zero
        if (Math.abs(this.physics.velocity.x) < 0.1) this.physics.velocity.x = 0;

        switch (this.state) {
            case Player.states.STAGGERED:
                this.staggerTimeout -= this.game.clockTick;
                if (this.staggerTimeout <= 0) {
                    this.state = Player.states.IDLE;
                    this.stateLock = false;
                    console.log("No longer staggered!")
                }
                break;
            case Player.states.ATTACK :

                break;
            case Player.states.MOVE :
                const newVelocity =
                    this.constantVelocity[DIRECTIONS.LEFT]
                    + this.constantVelocity[DIRECTIONS.RIGHT];

                if (newVelocity === 0) {
                    this.setState(Player.states.IDLE);
                } else {
                    this.physics.velocity.x = newVelocity;
                    this.setState(Player.states.MOVE);
                }
                break;
            case Player.states.IDLE :
                break;
            case Player.states.DEAD:
                this.physics.velocity.x = 0;
                this.physics.velocity.y = 0;
                break;
        }

        this.onGround = false;

        super.update();
    }

    // SECTION: helpers

    updateAttackHitboxBounds() {
        const box = this.hitbox.bounds;
        const w = box.dimension.width;
        const attackWidth = this.attackHitbox.bounds.dimension.width;

        let startX;
        if (this.facing === DIRECTIONS.RIGHT) {
            startX = box.start.x() + w;
        } else {
            startX = box.start.x() - attackWidth; // push it to the left of the body
        }

        this.attackHitbox.bounds.setStart(startX, this.attackHitbox.bounds.start.y());
    }
}

/**
 * A more concrete implementation of the hitbox, specifically for the player to make use of
 * @author Kassie Whitney
 * @author Roman Bureacov
 */
class AttackHitbox extends Hitbox {

    /**
     * The track of total time in seconds
     * @type {number}
     */
    totalTime = 0;

    /**
     * @type {Player}
     */
    parent; // override, to enforce JSDoc type checking

    /**
     * A flag that says if the update loop should expire this hitbox.
     *
     * Note that the game loop is to intersect -> update on hitboxes
     * @type {boolean}
     */
    shouldExpire = false;

    /**
     *
     * @param {Player} parent
     * @param {Rectangle2D} bounds
     */
    constructor(parent, bounds) {
        super(parent, bounds);
        this.kind = HITBOX_TYPE.ATTACK;
        this.parent = parent;
    }

    reset() {
        this.enabled = false;
        this.expired = false;
        this.totalTime = 0;
    }

    update(timestep) {
        this.totalTime += timestep;

        if (this.shouldExpire) {
            this.expired = true;
            this.enabled = false;
            this.shouldExpire = false;
            this.totalTime = 0;
            return;
        }

        // we need a little delay, so that
        // clashing is a little more probable
        // when players are closer together
        if (this.totalTime > 0.9) {
            // expire hitbox
            this.expired = true;
            this.enabled = false;
            this.totalTime = 0;
        } else if (this.totalTime > 0.1) {
            this.enabled = true;
        }
    }

    /**
     * The function used on response to intersection
     *
     * @param {IntersectionTestProperties} props
     */
    resolveIntersection(props) {
        const otherHb = props.other;
        const otherParent = otherHb.parent;

        // consume hitbox on next update
        this.shouldExpire = true;

        if (otherParent instanceof TileEntity) {
            console.log("Knocked back from tile");
            this.parent.knockback(1, 0)
        } else if (otherParent instanceof Player) {
            // well, what type of hitbox did we intersect with?
            if (otherHb.kind === HITBOX_TYPE.ATTACK) {
                // just bounce off
                this.parent.knockback(3, 4)
                otherParent.knockback(3, 4);
                SoundFX.play("swordCollide8");
            } else if (otherHb.kind === HITBOX_TYPE.BODY) {
                // do we bounce off?
                if (otherParent.state === Player.states.ATTACK
                    && areFacingEachOther(this.parent, otherParent)
                ) { // we want to only bounce off if we're facing towards each other
                    this.parent.knockback(
                        Player.CONSTANTS.KNOCKBACK.CLASH.x,
                        Player.CONSTANTS.KNOCKBACK.CLASH.y
                    );
                    otherParent.knockback(
                        Player.CONSTANTS.KNOCKBACK.CLASH.x,
                        Player.CONSTANTS.KNOCKBACK.CLASH.y
                    );
                    SoundFX.play("swordCollide8");
                } else {
                    // just do damage
                    otherParent.hit(10);

                    const sign = (
                        areFacingEachOther(this.parent, otherParent)
                    ) ? 1: -1;

                    otherParent.knockback(
                        sign * Player.CONSTANTS.KNOCKBACK.HIT.x,
                        Player.CONSTANTS.KNOCKBACK.HIT.y
                    )
                }
            }
        }
    }
}

class FinisherHitbox extends Hitbox {

    /**
     * The total time accumulated in seconds
     * @type {number}
     */
    totalTime = 0;

    reset() {
        super.reset();
        this.totalTime = 0;
    }

    update(timestep) {
        this.totalTime += timestep;

        if (this.totalTime > 0.9) {
            // despawn
            this.enabled = false;
            this.expired = true;
            this.totalTime = 0;
        }
    }

    resolveIntersection(props) {
        if (props.other.parent === this.parent) return;
        const other = props.other.parent;

        if (other instanceof Player) {
            if (other.state === Player.states.STAGGERED) {
                other.finish();
            }
        }
    }
}

/**
 * Tests if two players are facing each other
 * @param {Player} playerA
 * @param {Player} playerB
 * @return {boolean} if the two player are facing each other, false otherwise
 */
const areFacingEachOther = (playerA, playerB) => {
    if (playerA.facing === playerB.facing) return false;

    if (playerA.objectX() >= playerB.objectX()) {
        return playerA.facing === DIRECTIONS.LEFT
            && playerB.facing === DIRECTIONS.RIGHT
    } else {
        return playerA.facing === DIRECTIONS.RIGHT
            && playerB.facing === DIRECTIONS.LEFT
    }
}