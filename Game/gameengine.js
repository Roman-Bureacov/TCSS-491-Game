// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

import {Timer} from "./timer.js";
import {Render} from "./render/Render.js";
import {DynamicEntity} from "./entity.js";

export class GameEngine {

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
     * Constructs a game engine
     * @param options engine options
     * @param {Render} renderer the renderer the engine will draw
     */
    constructor(options, renderer) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;

        // Options and the Details
        this.options = options || {
            debugging: true,
        };

        this.render = renderer
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {

        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        //
        // this.ctx.canvas.addEventListener("mousemove", e => {
        //     if (this.options.debugging) {
        //         console.log("MOUSE_MOVE", getXandY(e));
        //     }
        //     this.mouse = getXandY(e);
        // });
        //
        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });
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

            if (this.options.debugging) {
                console.log(event);
            }

        };

        this.ctx.canvas.addEventListener("keydown", event => acknowledge(event));
        this.ctx.canvas.addEventListener("keyup", event => acknowledge(event))
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        // this.ctx.clearRect(0, 0, this.ctx.canvas.frameWidth, this.ctx.canvas.frameHeight);

        /*
        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }
         */

        this.render.render(this.ctx);
    };

    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                if (entity instanceof DynamicEntity) entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
        this.keys = {};
    };

}

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

// KV Le was here :)