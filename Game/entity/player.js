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
        /** the player was hit, sends old health and new health */
        HIT : "Player.HIT",
        /** the player has died, sends the player itself */
        DIED : "Player.DIED",
    })

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

        this.playerHealth = 100;

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
        this.initHitbox();
        this.setupCombatHitboxes();

    }

    /**
     * Sets up the players attack and body hitboxes, adds it to the game engine. Sets the dynamic hitboxes.
     */
    setupCombatHitboxes() {
        this.type = "player";
        this._alreadyHit = new Set();
        this._clashed = new Set();

        this.hitbox.kind = HITBOX_TYPE.BODY; // <-- duplicated fragment
        this.hitbox.enabled = true;

        this.attackHitbox = new Hitbox(this, new Rectangle2D(0, 0, .05, 1));

        this.attackHitbox.kind = HITBOX_TYPE.ATTACK;
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
        if (attacker._clashed.has(victim)) return;

        if (otherHb.kind === HITBOX_TYPE.ATTACK) {
            const victimIsAttacking =
                victim.state === Player.states.ATTACK && victim.attackHitbox.enabled;
            if (!victimIsAttacking) return;

            attacker._clashed.add(victim);
            victim._clashed.add(attacker);

            attacker.attackHitbox.enabled = false;
            victim.attackHitbox.enabled = false;

            SoundFX.play("swordCollide8")

            // PUSH BOTH BACK
            attacker.applyKnockbackFrom(victim);
            victim.applyKnockbackFrom(attacker);

            return;
        }

        if (otherHb.kind !== HITBOX_TYPE.BODY) return;
        if (attacker._alreadyHit.has(victim)) return;

        const bothAttacking = attacker.attackHitbox.enabled && victim.attackHitbox.enabled;

        const swordsOverlap =
            bothAttacking &&
            attacker.attackHitbox.bounds.intersects?.(victim.attackHitbox.bounds);

        if (swordsOverlap) {
            attacker._clashed.add(victim);
            victim._clashed.add(attacker);

            attacker.attackHitbox.enabled = false;
            victim.attackHitbox.enabled = false;

            return;
        }

        // Damage
        victim.setPlayerHealth?.(10);
        victim.attackHitbox.enabled = false;
        attacker._alreadyHit.add(victim);
        console.log(attacker.name, ": ", attacker.playerHealth)
        console.log(victim.name, ": ", victim.playerHealth)
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


        if (this.playerHealth === 0) {

            this.playerHealth -= 1;

            let rnd_int = Math.floor(Math.random() * 5) + 1;
            switch (getCharacterData(this.name).gender) {

                case "female": {
                    const sound = `femaleDeath${rnd_int}`
                    SoundFX.play(sound)
                    break;

                }

                case "male": {
                    const sound = `maleDeath${rnd_int}`
                    SoundFX.play(sound)
                    break;
                }
            }


            SoundFX.stop();

            SoundFX.play("victory");

            this.die();

            // setTimeout(() => {
            //     this.game.running = false;
            // }, 1000);

        } else if (this.playerHealth > 0) {
            this.playerHealth -= damage;

            let rnd_int = Math.floor(Math.random() * 7) + 1;
            switch (getCharacterData(this.name).gender) {

                case "female": {
                    const sound = `femaleHurt${rnd_int}`
                    SoundFX.play(sound)
                    break;

                }

                case "male": {
                    const sound = `maleHurt${rnd_int}`
                    SoundFX.play(sound)
                    break;
                }
            }
        }
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

    initHitbox() {

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

        console.log(this.name, ": New Swing action")

        this.lastState = this.state;
        this.state = Player.states.ATTACK;
        this.stateLock = true;

        this._clashed.clear();
        this._alreadyHit.clear();
        this.updateAttackHitboxBounds();
        this.attackHitbox.enabled = true;

        console.log(this.physics.position.y)

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

        // for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        for (let k in this.game.keys) {
            // console.log("Player got event:", this.game.keys[k].type, this.game.keys[k].code);
            this.keymapper.sendKeyEvent(this.game.keys[k]);
        }

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
        const box = this.drawingProperties.bounds;
        const w = box.dimension.width;
        const h = box.dimension.height;

        const dimX = w ;
        const dimY = h ;

        const startY = box.start.y() - h * 0.20;

        let startX;
        if (this.facing === DIRECTIONS.RIGHT) {
            startX = box.start.x() - w * .20;
        } else {
            startX = box.start.x() - dimX * 0.20; // push it to the left of the body
        }

        this.attackHitbox.bounds.setStart(startX, startY);
        this.attackHitbox.bounds.setDimension(dimX, dimY);
    }

}