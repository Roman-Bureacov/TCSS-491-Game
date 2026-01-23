/*
This code manages animation.
 */

// const toMatrix = (rows, columns, image) => {
//     const m = new Matrix(rows, columns);
//
//     const w = image.width / columns;
//     const h = image.height / rows;
//
//     for (let r = 0; r < rows; r++) {
//         for (let c = 0; c < columns; c++) {
//             m.set(r, c, {"x": c * w, "y": r * h});
//         }
//     }
//
//     return m;
// }

class Animator {
    /**
     * Creates an animator for handling animations
     * @param spritesheet the spritesheet object
     * @param {Array<[Number, Number]>} frames the frames that this animator is responsible for, where
     * the first entry is the row and the second is the column in the spritesheet matrix
     * @param duration the total duration of this animation
     * @param [isLooping=true] if the animation should loop
     * @param [callback=undefined] if the animation does not loop, this no-argument callback
     * is called once the animation has completed
     */
    constructor(spritesheet, frames, duration, isLooping = true, callback = undefined) {
        Object.assign(this, { spritesheet, frames, duration, isLooping, callback });

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
            this.spritesheet.width, this.spritesheet.height,
            x, y,
            this.spritesheet.width * scaleX, this.spritesheet.height * scaleY
            );

    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDelay);
    }

    reset() {
        this.elapsedTime = 0;
    }
}

class Spritesheet extends Matrix {
    constructor(image, rows, columns) {
        super(rows, columns);
        Object.assign(this, { image, tileRows: rows, columns });

        this.width = image.width / columns;
        this.height = image.height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                this.set(r, c, {x: c * this.width, y: r * this.height});
            }
        }
    }
}