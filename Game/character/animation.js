/*
This code manages animation.
 */

import {Matrix} from "../../Matrix/Matrix.js";

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
        row : 0,
        col : 0,
    }

    /**
     * Creates an animator for handling animations
     * @param spritesheet the spritesheet object
     * @param {Array<[Number, Number]>} frames the frames that this animator is responsible for, where
     * the first entry is the row and the second is the column in the spritesheet matrix; the frames should
     * be sorted from the start of the animation to the end of the animation
     * @param duration the total duration of this animation
     * @param [reversed=false] if the animation should reverse the individual frames
     * @param {{ [key: Number]: Audio}} [soundMap=undefined] the map of zero-indexed frame numbers to their audio object
     * @param [isLooping=true] if the animation should loop
     * @param [callback=undefined] if the animation does not loop, this no-argument callback
     * is called once the animation has completed
     */
    constructor(spritesheet,
                frames, duration, reversed = false,
                soundMap = undefined,
                isLooping = true, callback = undefined) {
        Object.assign(this, { spritesheet, frames, duration, reversed, soundMap, isLooping, callback });

        this.lastFrame = -1;

        this.frameDelay = this.duration / frames.length;
        this.elapsedTime = 0;
    }

    /**
     * Tells this animator to update
     */
    update(timeStep) {
        this.elapsedTime += timeStep;

        let frameNumber = this.currentFrameNumber();

        // if at the last frame...
        if (frameNumber === this.frames.length - 1) this.isLooping ? this.elapsedTime = 0 : this.callback?.();
        if (this.lastFrame !== frameNumber) {
            this.lastFrame = frameNumber;
            this.soundMap?.[frameNumber]?.play();
        }

        let frame = this.frames[frameNumber];
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
 * The object representing a spritesheet as an immutable matrix of frames.
 *
 * Entries stored are {x: number, y: number} indicating the position of the frame in pixels.
 *
 * @author Roman Bureacov
 */
export class Spritesheet extends Matrix {
    constructor(image, rows, columns) {
        super(rows, columns);
        Object.assign(this, { image, rows, columns });

        this.width = image.width / columns;
        this.height = image.height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                this.set(r, c, {x: c * this.width, y: r * this.height});
            }
        }

        this.matrix = Object.freeze(this.matrix);
    }
}