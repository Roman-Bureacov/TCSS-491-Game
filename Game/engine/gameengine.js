// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

import {Render} from "./render/Render.js";
import {DynamicEntity} from "../entity/entity.js";
import {MatrixOp} from "../../lib/Matrix/Matrix.js";
import {Point} from "./primitives.js";
import {PropertyChangeSupport} from "../../lib/propertychangesupport.js";
import {Player} from "../entity/player.js";

/**
 * The game engine
 * 
 * @implements {PropertyChangeNotifier}
 */
export class GameEngine {

    /**
     * The maximum time step for the game to run, in milliseconds
     * @type {Number}
     */
    static SIM_STEP = 1/60 * 1000;

    /**
     * The maximum number of sim steps that may occur before
     * going straight to rendering
     * @type {number}
     */
    static SIM_MAX_STEP_COUNT = 15;

    /**
     * The renderer for this engine
     * @type Render
     */
    render;

    /**
     * The map of key codes registered before the loop iteration
     * @type {{string : KeyboardEvent}} the map of key codes to their event details
     */
    keys = {};

    /**
     * The focus, what two players the camera will focus on
     * when the engine iterates.
     *
     * If one of both characters aren't defined, then
     * the engine will not try to focus the camera.
     *
     * @type {{playerA: Player, playerB: Player}}
     */
    focus = {
        playerA: undefined,
        playerB: undefined,
    }

    /**
     * The last time stamp recorder in ms
     * @type {number}
     */
    lastTimeStamp = Date.now();

    /**
     * The accumulated time in ms
     * @type {number}
     */
    accumulatedTime = 0;

    /**
     * Constructs a game engine
     * @param options engine options
     * @param {Render} renderer the renderer the engine will draw
     */
    constructor(options, renderer) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        this.PCS = new PropertyChangeSupport();

        // Everything that will be updated and drawn each frame
        /**
         * The collection of entities.
         *
         * Dynamic entities will be updated every simulation iteration.
         *
         * Static entities are not updated on simulation iteration.
         *
         * @type {{dynamic: DynamicEntity[], static: StaticEntity[]}}
         */
        this.entities = {
            dynamic: [],
            static: []
        }

        /**
         * The collection of static and dynamic hitboxes.
         *
         * Dynamic hitboxes will actively check for intersections on every simulation iteration.
         *
         * Static hitboxes only exist and don't actively check for intersections,
         * only resulting in intersections.
         *
         * @type {{dynamic: Hitbox[], static: Hitbox[]}}
         */
        this.hitboxes = {
            dynamic: [],
            static: []
        }

        // Options and the Details
        this.options = options || {
            debugging: true,
        };

        this.render = renderer;
    };

    /** @inheritDoc */
    addPropertyListener(prop, listener) {
        this.PCS.addPropertyListener(prop, listener);
    }
    /** @inheritDoc */
    removePropertyListener(prop, listener) {
        this.PCS.removePropertyListener(prop, listener);
    }
    /** @inheritDoc */
    notifyListeners(prop, then = undefined, now = undefined) {
        this.PCS.notifyListeners(prop, then, now);
    }

    /**
     * Initializes game input and context
     * @param {CanvasRenderingContext2D} ctx
     */
    init(ctx) {
        this.ctx = ctx;
        this.startInput();
    };

    start() {
        this.running = true;

        const gameLoop = (now) => {
            if (!this.running) return;

            const frameTime = now - this.lastTimeStamp;
            this.lastTimeStamp = now;

            this.loop(frameTime);

            // note that since the game relies on the `requestAnimationFrame`
            // the game *will pause when the window isn't being drawn*
            window.requestAnimationFrame(gameLoop);
        };

        this.lastTimeStamp = performance.now();
        window.requestAnimationFrame(gameLoop); // accepts a function and passes in one argument (see doc)
    }


    startInput() {

        // const getXandY = e => ({
        //     x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
        //     y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        // });
        //
        // this.ctx.canvas.addEventListener("mousemove", e => {
        //     if (this.options.debugging) {
        //         console.log("MOUSE_MOVE", getXandY(e));
        //     }
        //     this.mouse = getXandY(e);
        // });
        //
        // this.ctx.canvas.addEventListener("click", e => {
        //     if (this.options.debugging) {
        //         console.log("CLICK", getXandY(e));
        //     }
        //     this.click = getXandY(e);
        // });
        //
        // this.ctx.canvas.addEventListener("wheel", e => {
        //     if (this.options.debugging) {
        //         console.log("WHEEL", getXandY(e), e.wheelDelta);
        //     }
        //     e.preventDefault(); // Prevent Scrolling
        //     this.wheel = e;
        // });
        //
        // this.ctx.canvas.addEventListener("contextmenu", e => {
        //     if (this.options.debugging) {
        //         console.log("RIGHT_CLICK", getXandY(e));
        //     }
        //     e.preventDefault(); // Prevent Context Menu
        //     this.rightclick = getXandY(e);
        // });
        //
        // this.ctx.canvas.addEventListener("keydown", event => {
        //     this.keys[event.key] = true;
        //     console.log(event.key);
        // });
        // this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);


        const acknowledge = (event) => {
            this.keys[event.code] = event;
            // if (this.options.debugging) {
            //     console.log(event);
            // }

        };

        this.ctx.canvas.addEventListener("keydown", event => acknowledge(event));
        this.ctx.canvas.addEventListener("keyup", event => acknowledge(event))
    };

    /**
     * Adds a dynamic entity and spawns its associated hitbox property into the game.
     * @param {DynamicEntity} entity the dynamic entity
     */
    addDynamicEntity(...entity) {
        entity.map(e => {
            this.entities.dynamic.push(e);
            if (e.hitbox) this.hitboxes.dynamic.push(e.hitbox);
        });

    }

    /**
     * Adds a static entity and spawns its associated hitbox property into the game.
     * @param {StaticEntity} entity the static entity
     */
    addStaticEntity(...entity) {
        entity.map(e => {
            this.entities.static.push(e);
            if (e.hitbox) this.hitboxes.static.push(e.hitbox);
        });
    };

    /**
     * Spawns a dynamic hitbox in which this game engine becomes aware of
     * @param {Hitbox} hitbox the hitbox to make the game aware of
     */
    spawnDynamicHitbox(hitbox) {
        this.hitboxes.dynamic.push(hitbox)
    }

    /**
     * Tells this engine's renderer to draw
     */
    draw() {

        // should we focus?
        if (this.focus.playerA && this.focus.playerB) {
            const minDepth = 4;
            const maxDepth = 8;

            // make the looking "bounding box" by using the centers of the primary hitboxes
            let A = this.focus.playerA;
            let B = this.focus.playerB;
            let lookA = new Point( // center of A
                (A.hitbox.bounds.start.x() + A.hitbox.bounds.end.x()) / 2,
                (A.hitbox.bounds.start.y() + A.hitbox.bounds.end.y()) / 2,
            );
            let lookB = new Point( // center of B
                (B.hitbox.bounds.start.x() + B.hitbox.bounds.end.x()) / 2,
                (B.hitbox.bounds.start.y() + B.hitbox.bounds.end.y()) / 2,
            );

            // we try to focus based on the bounds
            // that both sprites make
            // the start of A and the end of B
            const lookStart = MatrixOp.multiply(
                this.focus.playerA.transform,
                lookA
            )
            const lookEnd = MatrixOp.multiply(
                this.focus.playerB.transform,
                lookB
            )

            const lookX = (lookStart.get(0, 0) + lookEnd.get(0, 0)) / 2;
            const lookY = (lookStart.get(1, 0) + lookEnd.get(1, 0)) / 2;


            this.render.camera.lookAt(
                lookX, lookY
            );


            // new depth is the X we wish to see divided by the tan of the theta FOV
            // theta FOV is the arctan of the canvas width over the focal length
            const lookWidth = Math.abs(lookX - lookStart.get(0, 0));
            const lookHeight = Math.abs(lookY - lookStart.get(1, 0));
            const lookRadius = Math.sqrt(lookWidth ** 2 + lookHeight ** 2);
            const canvas = this.render.camera.getCanvas();
            const newDepth = lookRadius / (canvas.right * 2 / this.render.camera.focalLength);

            this.render.camera.setDepth(
                Math.min(
                    Math.max(minDepth, newDepth),
                    maxDepth
                )
            )
        }

        this.render.render(this.ctx);
    };

    /**
     * Updates the dynamic entities recognized by this engine
     */
    updateEntities() {
        for (let i = 0; i < this.entities.dynamic.length; i++) {
            if (this.entities.dynamic[i].expired) {
                this.entities.dynamic.splice(i, 1);
            } else {
                this.entities.dynamic[i].update();
            }
        }
    };

    /**
     * Find any and all intersections between dynamic hitboxes and every other hitbox
     */
    detectIntersections() {
        const dyn = this.hitboxes.dynamic;
        const stat = this.hitboxes.static;

        // dynamic vs dynamic (unique pairs only)
        for (let i = 0; i < dyn.length; i++) {
            const h1 = dyn[i];
            if (h1.expired || !h1.enabled) continue;

            // need to loop over the list such that every intersection
            //   is resolved once. Note that both hitboxes get a change to react
            //   so it is necessary to iterate as such to prevent the same pair
            //   getting evaluated more than once
            for (let j = i + 1; j < dyn.length; j++) {
                const h2 = dyn[j];
                if (h2.expired || !h2.enabled) continue;

                // same parent => ignore (prevents self-hitboxes hitting each other if you add multiple)
                if (h1.parent === h2.parent) continue;

                const props = h1.intersects(h2);
                if (!props) continue;

                // let both respond

                h1.resolveIntersection(props);
                h2.resolveIntersection({
                    subject: h2,
                    other: h1,
                    subjectStartX: props.otherStartX,
                    subjectStartY: props.otherStartY,
                    subjectEndX: props.otherEndX,
                    subjectEndY: props.otherEndY,
                    otherStartX: props.subjectStartX,
                    otherStartY: props.subjectStartY,
                    otherEndX: props.subjectEndX,
                    otherEndY: props.subjectEndY,
                });
            }

            for (let h2 of stat) {
                if (h2.expired || !h2.enabled) continue;

                const props = h1.intersects(h2);
                if (props) h1.resolveIntersection(props);
            }
        }

    }


    /**
     * updates the dynamic hitboxes, removing them if they expired
     */
    updateHitboxes() {
        for (let i = 0; i < this.hitboxes.dynamic.length; i++) {
            if (this.hitboxes.dynamic[i].expired) {
                this.hitboxes.dynamic.splice(i, 1);
            } else {
                this.hitboxes.dynamic[i].update(this.clockTick);
            }
        }
    }

    /**
     * Core loop of the game engine, specifically looping:
     *
     *   1. update dynamic entities
     *   2. find hitbox intersections and resolve
     *   3. update hitbox states
     *   4. draw
     *
     * @param {number} dt the time step in milliseconds
     */
    loop(dt) {

        // what's this?
        // see: https://www.gafferongames.com/post/fix_your_timestep/
        this.accumulatedTime += dt;
        let steps = 0;

        while (
            this.accumulatedTime >= GameEngine.SIM_STEP
            && steps < GameEngine.SIM_MAX_STEP_COUNT
        ) {
            this.clockTick = GameEngine.SIM_STEP / 1000;
            this.updateEntities();
            this.detectIntersections();
            this.updateHitboxes();

            this.accumulatedTime -= GameEngine.SIM_STEP;
            steps++;
            this.keys = {};
        }

        if (steps >= GameEngine.SIM_MAX_STEP_COUNT) {
            console.log(`
Warning: took too many steps updating.
simulation behind ${
    Math.floor(this.accumulatedTime / GameEngine.SIM_STEP)
} step(s).
Truncating...
            `);
            this.accumulatedTime %= GameEngine.SIM_STEP;
        }

        this.draw()
    };

}
//
// /** Creates an alias for requestAnimationFrame for backwards compatibility */
// window.requestAnimFrame = (() => {
//     return window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         window.oRequestAnimationFrame ||
//         window.msRequestAnimationFrame ||
//         /**
//          * Compatibility for requesting animation frames in older browsers
//          * @param {Function} callback Function
//          * @param {DOM} element DOM ELEMENT
//          */
//         ((callback, element) => {
//             window.setTimeout(callback, 1000 / 60);
//         });
// })();

// KV Le was here :)