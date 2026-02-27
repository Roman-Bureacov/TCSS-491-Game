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
import {getCharacterData} from "./characterData.js";
import {DIRECTIONS} from "../engine/constants.js";

/**
 * The collection of vitality statistics
 * @typedef VitalityStats
 * @property {number} health the amount of health remaining
 * @property {number} posture the amount of posture gained
 * @property {number} souls the amount of souls remaining
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
        /** the player was hit, sends old health as then and new health as now */
        HIT: "Player.HIT",
        /** the player has died, sends the player itself as now */
        DIED: "Player.DIED",
    })

    /**
     * Collection of constants pertaining to the player
     * @readonly
     * @type {{
     *     VITALITY_MAXIMUMS : VitalityStats,
     *     POSTURE_DRAIN_PER_SECOND : number
     * }}
     */
    static CONSTANTS = Object.freeze({
        VITALITY_MAXIMUMS: {
            health: 100,
            posture: 100,
            souls: 3
        },
        POSTURE_DRAIN_PER_SECOND: 10
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
    });

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

        this.state = Player.states.IDLE;
        this.physics.velocityMax.x = 10;

        // Knockback / hit control
        this.knockbackTimer = 0;      // seconds remaining
        this.knockbackDuration = 0.12; // tune (0.08–0.20)
        this.knockbackStrength = 1.5;   // tune for push distance
        this.knockbackLift = 0.5;      // optional small vertical bump

        this.constantAcceleration = {
            [DIRECTIONS.LEFT]: 0,
            [DIRECTIONS.RIGHT]: 0,
        };
        this.physics.velocityMax.x = 5;
        this.physics.velocityMax.y = 10;
        this.lastState = this.state;

        this.gravity = -20;

        this.initKeymap();
        this.initSelfHitbox();
        this.initAttackHitbox();

    }

    /**
     * Sets up the players attack and body hitboxes, adds it to the game engine. Sets the dynamic hitboxes.
     */
    initAttackHitbox() {
        /** @deprecated */
        this.type = "player";

        this._alreadyHit = new Set();
        this._clashed = new Set();

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

    applyKnockbackFrom(other, strength = this.knockbackStrength) {
        // Direction: push away from the other player
        const dir = (this.objectX() < other.objectX()) ? -1 : 1;

        // Cancel player-driven acceleration so they slide back cleanly
        this.constantAcceleration[DIRECTIONS.LEFT] = 0;
        this.constantAcceleration[DIRECTIONS.RIGHT] = 0;

        // Set a short timer during which we don't zero velocity.x in update()
        this.knockbackTimer = this.knockbackDuration;

        // Apply the impulse
        this.physics.velocity.x = dir * strength;

        // Optional: little "pop" so it feels like impact
        // Only if you're on ground or you want it always
        if (this.onGround) {
            this.physics.velocity.y = Math.max(this.physics.velocity.y, this.knockbackLift);
            this.onGround = false;
        }
    }

    setPlayerHealth(damage) {
        console.log("Taking damage...")

        const oldHealth = this.vitality.health;
        this.vitality.health -= damage;
        let rnd_int = Math.floor(Math.random() * 5) + 1;
        let sound;
        this.notifyListeners(Player.PROPERTIES.HIT, oldHealth, this.vitality.health);

        if (this.vitality.health > 0) {
            switch (getCharacterData(this.name).gender) {
                case "female":
                    sound = `femaleHurt${rnd_int}`
                    break;
                case "male":
                    sound = `maleHurt${rnd_int}`
                    break;
            }

        } else {
            // player has health <= 0, they're "dead"
            // TODO: revise this to not be dead on health <= 0
            this.vitality.health = 0;

            switch (getCharacterData(this.name).gender) {
                case "female":
                    sound = `femaleDeath${rnd_int}`
                    break;
                case "male":
                    sound = `maleDeath${rnd_int}`
                    break;
            }

            this.notifyListeners(Player.PROPERTIES.DIED);
        }

        SoundFX.play(sound)


        /*
        if (this.vitality.health === 0) {
            HUD.updateCharacterName()
            SoundFX.stop();
            SoundFX.play("victory");

        } else if (this.vitality.health > 0) {
        }
        */
    }

    initKeymap() {
        this.keymapper = new KeyMapper();
        this.keymapper.outputMap = {
            "move right": () => this.move(800),
            "move left": () => this.move(-800),
            "attack": () => this.swing(),
            "stop right": () => this.stopMoving(DIRECTIONS.RIGHT),
            "stop left": () => this.stopMoving(DIRECTIONS.LEFT),
            "jump": () => this.jump(),
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
                            this.constantAcceleration[DIRECTIONS.LEFT] +
                            this.constantAcceleration[DIRECTIONS.RIGHT];

                        this.state = (ax !== 0) ? Player.states.MOVE : Player.states.IDLE;
                    }
                }

                this.physics.position.x = this.objectX();
                this.physics.position.y = this.objectY();
            }
        }
    }


    /**
     * Sets the acceleration for this character
     * @param acceleration
     */
    move(acceleration) {
        if (!this.setState(Player.states.MOVE)) {
            const newFacing = acceleration < 0 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
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
        if (this.stateLock) return;


        this.lastState = this.state;
        this.state = Player.states.ATTACK;
        this.stateLock = true;

        this._clashed.clear();
        this._alreadyHit.clear();
        this.updateAttackHitboxBounds();
        this.attackHitbox.enabled = true;
        this.attackHitbox.expired = false;
        this.game.spawnDynamicHitbox(this.attackHitbox);


        SoundFX.play(getCharacterData(this.name).swordSound);
    }


    /**
     * causes this player to jump
     */
    jump() {
        if (!this.stateLock) {
            if (this.onGround) {
                this.onGround = false;
                this.physics.velocity.y = this.gravity * -1 + 3;
                this.state = Player.states.JUMP;
            }
        }

    }

    /**
     * Triggers dying animation.
     */
    die() {

        this.state = Player.states.DEAD;
        this.stateLock = true;
        this.notifyListeners(Player.PROPERTIES.DIED)

    }

    update() {
        this.physics.acceleration.y = this.gravity;

        // send the keys for this player to process
        for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        // natural drain of the posture
        this.vitality.posture = Math.max(
            0,
            Math.min(
                Player.CONSTANTS.VITALITY_MAXIMUMS.posture,
                this.vitality.posture -= Player.CONSTANTS.POSTURE_DRAIN_PER_SECOND * this.game.clockTick
            )
        );

        switch (this.state) {
            case Player.states.JUMP:
                this.physics.acceleration.x =
                    this.constantAcceleration[DIRECTIONS.LEFT] +
                    this.constantAcceleration[DIRECTIONS.RIGHT];
                break;
            case Player.states.ATTACK :

                break;
            case Player.states.MOVE :
                this.physics.acceleration.x = 0;

                this.physics.acceleration.x =
                    this.constantAcceleration[DIRECTIONS.LEFT]
                    + this.constantAcceleration[DIRECTIONS.RIGHT];

                if (this.physics.acceleration.x === 0) {
                    this.setState(Player.states.IDLE);
                } else this.setState(Player.states.MOVE);
                break;
            case Player.states.IDLE :
                this.physics.velocity.x = 0;
                break;

            case Player.states.DEAD:
                this.physics.velocity.x = 0;
                this.physics.velocity.y = 0;
                break;
        }

        super.update();
    }

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

    update(timestep) {
        this.totalTime += timestep;

        if (this.shouldExpire) {
            this.expired = true;
            this.enabled = false;
            this.shouldExpire = false;
            this.totalTime = 0;
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
            this.parent.physics.velocity.x += 1;
        } else if (otherParent instanceof Player) {
            // well, what type of hitbox did we intersect with?
            if (otherHb.kind === HITBOX_TYPE.ATTACK) {
                // just bounce off
                this.parent.physics.velocity.x = -1;
                otherParent.physics.velocity.x = 1;
                SoundFX.play("swordCollide8");
            } else if (otherHb.kind === HITBOX_TYPE.BODY) {
                // do we bounce off?
                if (otherParent.state === Player.states.ATTACK
                    && otherParent.facing !== this.parent.facing // lazy check
                ) { // we want to only bounce off if we're facing towards each other
                    this.parent.physics.velocity.x = -1;
                    otherParent.physics.velocity.x = 1;
                    SoundFX.play("swordCollide8");
                } else {
                    // just do damage
                    otherParent.setPlayerHealth(10);
                }
            }
        }
    }
}