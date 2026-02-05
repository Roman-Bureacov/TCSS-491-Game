/*
This code manages animation.
 */

import {Matrix} from "./Matrix/Matrix.js";
import {getCharacterData} from "./characterData.js";

/**
 * Object that represents a simple animator object
 *
 * @author Roman Bureacov
 */
export class Animator {
    /**
     * Creates an animator for handling animations
     * @param spritesheet the spritesheet object
     * @param yPadding
     * @param scale
     * @param {Array<[Number, Number]>} frames the frames that this animator is responsible for, where
     * the first entry is the row and the second is the column in the spritesheet matrix; the frames should
     * be sorted from the start of the animation to the end of the animation
     * @param duration the total duration of this animation
     * @param [isLooping=true] if the animation should loop
     * @param [callback=undefined] if the animation does not loop, this no-argument callback
     * is called once the animation has completed
     */
    constructor(spritesheet, yPadding, scale ,frames, duration, isLooping = true, callback = undefined) {
        Object.assign(this, { spritesheet,yPadding, scale ,frames, duration, isLooping, callback});

        this.frameDelay = this.duration / frames.length;
        this.elapsedTime = 0;
    }

    draw(timeStep, context, x, y, scaleX, scaleY) {
        this.elapsedTime += timeStep;

        let frameNumber = this.currentFrame();

        // if at the last frame...
        if (frameNumber === this.frames.length - 1) this.isLooping ? this.elapsedTime = 0 : this.callback?.();

        let frame = this.frames[frameNumber];
        let frameCoord = this.spritesheet.get(frame[0], frame[1]);

        context.drawImage(this.spritesheet.image,
            frameCoord.x, frameCoord.y,
            this.spritesheet.frameWidth, this.spritesheet.frameHeight,
            x, y + this.yPadding,
            this.spritesheet.frameWidth * scaleX * this.scale, this.spritesheet.frameHeight * scaleY * this.scale
            );
        

    }

    currentFrame() {
        
        return Math.floor(this.elapsedTime / this.frameDelay);
    }

    reset() {
        this.elapsedTime = 0;
    }
}

/**
 * Class that represents a spritesheet, indexing the frames with a definitive
 * row and column position object
 *
 * @author Roman Bureacov
 */
export class Spritesheet extends Matrix {

    /**
     * The width of the individual sprite frames in pixels
     * @type {number}
     */
    frameWidth = 0;

    /**
     * The height of the individual sprite frames in pixels
     * @type {number}
     */
    frameHeight = 0;


    constructor(image, rows, columns) {
        super(rows, columns);
        Object.assign(this, { image, rows, columns});

        this.frameWidth = image.width/ columns;
        this.frameHeight = image.height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                super.set(r, c, {x: c * this.frameWidth, y: r * this.frameHeight});
            }
        }
    }

    /**
     * Does nothing (cannot set values in a spritesheet
     */
    set(row, col, value) {

    }

    /**
     * Gets the coordinates for a specific frame in the sprite sheet
     * @param row the row to look at, 0-indexed
     * @param col the column to look at, 0-indexed
     * @returns {x: Number, y: Number} the frame x and y coordinate on the spritesheet
     */
    get(row, col) {
        return super.get(row, col);
    }
}