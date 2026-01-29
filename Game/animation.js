/*
This code manages animation.
 */

import {Matrix} from "../Matrix/Matrix.js";

/**
 * @typedef Frame
 * @property {number} row the frame row in the spritesheet
 * @property {number} col the frame column in the spritesheet
 */
export class Animator {

    /**
     * This animator's current frame
     * @type {Frame}
     */
    currentFrame = {
        row: 0,
        col: 0,
    }

    /**
     * Creates an animator for handling animations
     * @param spritesheet the spritesheet object
     * @param yPadding
     * @param scale
     * @param {Array<[Number, Number]>} frames the frames that this animator is responsible for, where
     * the first entry is the row and the second is the column in the spritesheet matrix; the frames should
     * be sorted from the start of the animation to the end of the animation
     * @param duration the total duration of this animation
     * @param [reversed = false] if the animation should reverse the individual frames
     * @param [isLooping=true] if the animation should loop
     * @param [callback=undefined] if the animation does not loop, this no-argument callback
     * is called once the animation has completed
     */
    constructor(spritesheet, yPadding, scale, frames, duration, reversed = false, isLooping = false, callback = undefined) {
        Object.assign(this, {spritesheet, yPadding, scale, frames, duration, reversed, isLooping, callback});

        this.lastFrame = -1;

        this.frameDelay = this.duration / frames.length;
        this.elapsedTime = 0;
    }

    /**
     * Tells this animator to update
     */
    update(timeStep) {
        this.elapsedTime += timeStep;

        let frameNumber = Math.floor(this.elapsedTime / this.frameDelay);

        if (frameNumber >= this.frames.length) {
            if (this.isLooping) {
                this.elapsedTime = 0;
                frameNumber = 0;
            } else {
                frameNumber = this.frames.length - 1;
                this.callback?.();
                console.log("Call back called.")
            }
        }

        if (this.lastFrame !== frameNumber) {
            this.lastFrame = frameNumber;
        }

        const frame = this.frames[frameNumber];
        this.currentFrame.row = frame[0];
        this.currentFrame.col = frame[1];
    }


    currentFrameNumber() {
        return Math.floor(this.elapsedTime / this.frameDelay);
    }

    reset() {
        this.elapsedTime = 0;
        this.lastFrame = -1;
    }
}

/**
 * Class that represents a spritesheet, indexing the frames with a definitive
 * row and column position object
 *
 * @author Roman Bureacov
 */
export class Spritesheet extends Matrix {
    constructor(imagePath, rows, columns) {
        super(rows, columns);
        Object.assign(this, {image: imagePath, rows, columns});
        this.frameWidth = imagePath.width / columns;
        this.frameHeight = imagePath.height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                super.set(r, c, {x: c * this.frameWidth, y: r * this.frameHeight});
            }
        }
        this.matrix = Object.freeze(this.matrix);
    }
}