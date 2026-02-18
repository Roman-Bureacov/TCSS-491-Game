/*
A concrete implementation of the character class
 */

import {Character} from "./character.js"
import {Spritesheet} from "./animation.js";
import {KeyMapper} from "../engine/keymapper.js";
import {CharacterFactory} from "./characterFactory.js";
import {Hitbox, HitboxOp} from "../engine/hitbox.js";
import {TileEntity} from "./tileEntity.js";
import {Rectangle2D} from "../engine/primitives.js";
import {SoundFX} from "../engine/soundFX.js";
import {getCharacterData} from "./characterData.js";


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
     * If this character is on the ground
     * @type {boolean}
     */
    onGround = false;

    /**
     * Constructs a new playable character with no animators and an empty input map.
     *
     * @param {GameEngine} game the game
     * @param {Spritesheet} spritesheet the spritesheet representing this character
     * @param {number} dimX the positive dimension of this character
     * @param {number} dimY the positive dimension of this character
     * @param {number} [startX=0] the starting x position
     * @param {number} [startY=0] the starting y position
     * @param facingDir The starting direction of the players.
     * @param name The name of the character.
     */
    constructor(game, spritesheet,
                dimX = 1, dimY = 1,
                startX = 0, startY = 0, facingDir, name) {
        super(game, spritesheet, dimX, dimY, startX, startY);


        this.playerHealth = 100;


        this.facing = facingDir;
        this.state = Player.states.IDLE;
        this.physics.velocityMax.x = 10;
        this.name = name;

        this.constantAcceleration = {
            [Character.DIRECTION.LEFT]: 0,
            [Character.DIRECTION.RIGHT]: 0,
        };
        this.lastState = this.state;


        let box = this.drawingProperties.bounds;
        this.hitbox = new Hitbox(
            this,
            new Rectangle2D(
                box.start.x(), box.start.y(),
                box.dimension.width, box.dimension.height
            )
        );

        this.gravity = -20;
        this.initKeymap();

        this.initHitbox();

        CharacterFactory.configurePlayer(this, this.name)

// IMPORTANT: engine only auto-adds e.hitbox, so we must spawn this extra one:

        this.setupCombatHitboxes();

    }

    /**
     * Sets up the players attack and body hitboxes, adds it to the game engine. Sets the dynamic hitboxes.
     */
    setupCombatHitboxes() {
        this.type = "player";
        this._alreadyHit = new Set();
        this._clashed = new Set();

        this.hitbox.kind = "body";
        this.hitbox.enabled = true;

        this.attackHitbox = new Hitbox(this, new Rectangle2D(0, 0, 1, 1));

        this.attackHitbox.kind = "attack";
        this.attackHitbox.enabled = false;

        this.game.spawnDynamicHitbox(this.attackHitbox);

        this.attackHitbox.resolveIntersection = this.onAttackHitboxIntersection.bind(this);
    }

    /**
     *
     * @param {PlayerOne, PlayerTwo} players
     */
    onAttackHitboxIntersection(players) {
        const attacker = players.subject.parent;
        const otherHb = players.other;
        const victim = otherHb.parent;

        if (victim.type !== "player") return;
        if (victim === attacker) return;
        if (attacker.state !== Player.states.ATTACK) return;

        // once clashed, never damage
        if (attacker._clashed.has(victim) || victim._clashed.has(attacker)) return;

        if (otherHb.kind === "attack") {
            attacker._clashed.add(victim);
            victim._clashed.add(attacker);

            attacker.attackHitbox.enabled = false;
            victim.attackHitbox.enabled = false;

            this.swordCollide();
            return;
        }

        if (otherHb.kind !== "body") return;
        if (attacker._alreadyHit.has(victim)) return;

        const bothAttacking = attacker.attackHitbox.enabled && victim.attackHitbox.enabled;

        // ⚠️ Only works if intersects exists; see note below
        const swordsOverlap =
            bothAttacking &&
            attacker.attackHitbox.bounds.intersects?.(victim.attackHitbox.bounds);

        if (swordsOverlap) {
            attacker._clashed.add(victim);
            victim._clashed.add(attacker);

            attacker.attackHitbox.enabled = false;
            victim.attackHitbox.enabled = false;

            this.swordCollide();
            return;
        }

        // Damage
        victim.setPlayerHealth?.(10);
        victim.attackHitbox.enabled = false;
        attacker._alreadyHit.add(victim);
    }


    swordCollide() {
        // set physics to push character back

        console.log("Sword collided")
        SoundFX.play("swordCollide1")
    }

    initKeymap() {
        this.keymapper = new KeyMapper();
        this.keymapper.outputMap = {
            "move right": () => this.move(800),
            "move left": () => this.move(-800),
            "attack": () => this.swing(),
            "stop right": () => this.stopMoving(Character.DIRECTION.RIGHT),
            "stop left": () => this.stopMoving(Character.DIRECTION.LEFT),
            "jump": () => this.jump(),
        };
    };

    initHitbox() {

        this.hitbox.resolveIntersection = (properties) => {
            if (properties.other.parent === this) {
                return;
            } else if (properties.other.parent instanceof TileEntity) {
                HitboxOp.separate(properties); // repositions object origin
                if (this.objectY() - this.physics.position.y > 0) {
                    // this entity was push up, therefore we must be on the ground
                    this.onGround = true;
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
        if (this.stateLock) return;

        this.lastState = this.state;
        this.state = Player.states.ATTACK;
        this.stateLock = true;

        this._clashed.clear();
        this._alreadyHit.clear();
        this.updateAttackHitboxBounds();
        this.attackHitbox.enabled = true;

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
            }
        }
    }

    update() {
        this.physics.acceleration.x = 0;
        this.physics.acceleration.y = this.gravity;

        // for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        for (let k in this.game.keys) {
            // console.log("Player got event:", this.game.keys[k].type, this.game.keys[k].code);
            this.keymapper.sendKeyEvent(this.game.keys[k]);
        }

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

    updateAttackHitboxBounds() {
        const box = this.drawingProperties.bounds;
        const w = box.dimension.width;
        const h = box.dimension.height;

        const dimX = w * 0.60;
        const dimY = h * 0.60;

        const startY = box.start.y() - h * 0.20;

        let startX;
        if (this.facing === Character.DIRECTION.RIGHT) {
            startX = box.start.x() + w * 0.60;
        } else {
            startX = box.start.x() - dimX * 0.60; // push it to the left of the body
        }

        this.attackHitbox.bounds.setStart(startX, startY);
        this.attackHitbox.bounds.setDimension(dimX, dimY);
    }

}