/*
Rendering code, however not a full renderer.

This code is to represent a 3D camera in a not-so-3D world.

The system has renderable objects, `Drawable`s, which provide the means
on where to draw themselves as well as.
 */

import { Matrix, MatrixOp } from "../../Matrix/Matrix.js";

/**
 * An object in space representing
 */
class SpaceObject {

    /**
     * The matrix representing this object
     * @type {Matrix}
     */
    matrix = MatrixOp.identity(4);

    constructor() {

    }

    /**
     * Transforms this object
     * @param {Matrix} transformation the matrix to transform by
     */
    transform(transformation) {
        this.matrix = MatrixOp.multiply(this.matrix, transformation);
    }
}


/**
 * @typedef {Object} DrawingProperties
 * @property {Spritesheet} spritesheet the spritesheet representing the drawable object
 * @property {number} row the row in the spritesheet to look at
 * @property {number} col the column in the spritesheet to look at
 */

/**
 * A drawable object for the renderer to draw.
 *
 * @author Roman Bureacov
 */
class Drawable extends SpaceObject {

    /**
     * The spritesheet representing this drawable object.
     * @type {Spritesheet}
     */
    spritesheet;

    /**
     * The drawing properties of this drawable object used for rendering.
     *
     * @type {DrawingProperties}
     */
    drawingProperties = {
        spritesheet : undefined,
        row: 0,
        col: 0,
    }

    /**
     * Creates a new drawable
     * @param {Spritesheet} spritesheet the spritesheet representing this object
     */
    constructor(spritesheet) {
        super();
        Object.assign(this, { spritesheet });
        this.drawingProperties.spritesheet = spritesheet;
    }

}

/**
 * Class that represents a pane in 3D space.
 *
 * @author Roman Bureacov
 */
class Pane extends SpaceObject {

    /**
     * The list of drawable entities in this world
     * @type {[Drawable]}
     */
    drawables = []

    constructor() {
        super();

    }

    /**
     * Appends drawable entities to this pane
     * @param {Drawable} drawable the drawable entity
     */
    addDrawable(drawable) {
        this.drawables.push(drawable);
    }

}

/**
 * Class that represents a camera in 3D space.
 *
 * Note that this camera does not represent near and far planes.
 *
 * The camera is modeled after a pinhole camera, and
 * it looks down the -Z axis
 *
 * @author Roman Bureacov
 */
class Camera extends SpaceObject {

    /**
     * The focal length for this camera, defined in millimeters.
     *
     * Use function instead to mutate focal length.
     *
     * @type {number}
     */
    focalLength = 10;

    /**
     * The image for this camera, defined in pixels
     * @type {{width: number, height: number, aspect: 0}}
     */
    image = {width: 0, height: 0, aspect: 0}

    /**
     * The aperture for this camera, defined in millimeters
     * @type {{width: number, height: number, aspect: number}}
     */
    aperture = {width: 0, height: 0, aspect: 0}

    /**
     * The canvas which this camera sees.
     *
     * If the camera's aperture parameters, or focal length, change, reassign this canvas
     * using the static method for computing the canvas coordinates.
     *
     * @typedef {Readonly<{left: number, right: number, top: number, bottom: number}>} canvas
     */
    canvas = undefined;

    /**
     * Constructs the camera with necessary parameters
     * @param imageWidth the image width
     * @param imageHeight the image height
     */
    constructor(imageWidth, imageHeight) {
        super();
        this.image.width = imageWidth;
        this.image.height = imageHeight;

        // for simplicity, both have the same aspect ratio in this project's context
        this.aperture.aspect = this.image.aspect = imageWidth / imageHeight;
        this.aperture.width = 22;
        this.aperture.height = this.aperture.width * this.aperture.aspect;

        this.canvas = Camera.getCanvas(this);
    }

    /**
     * Tells the camera to look at the specific coordinate with respect to
     * the world origin
     *
     * @param x the x coordinate with respect to the world origin
     * @param y the y coordiante with respect to the world origin
     */
    lookAt(x, y) {
        this.matrix.set(0, 3, x);
        this.matrix.set(1, 3, y);
    }

    /**
     * Sets focal length and recomputes the canvas coordinates
     * @param focalLength the new focal length in millimeters
     */
    setFocalLength(focalLength) {
        this.focalLength = focalLength;
        this.canvas = Camera.getCanvas(this);
    }

    /**
     * Calculates the camera's canvas coordinates
     * @param {Camera} camera the camera
     * @returns {Readonly<{left: number, right: number, top: number, bottom: number}>}
     *      the immutable canvas coordinates
     */
    static getCanvas(camera) {

        const canvas = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        }

        // for simplicity, near plane is 1: aperatureWidth / focal * nearPlaneZ
        const canvasWidth =   camera.aperture.width / camera.focalLength;

        canvas.left = -canvasWidth / 2;
        canvas.right = -canvas.left;
        canvas.top = canvasWidth / 2 * camera.aperture.aspect;
        canvas.bottom = -canvas.top;

        return Object.freeze(canvas);
    }
}

/**
 * Class that represents a renderer.
 *
 * @author Roman Bureacov
 */
class Render {

    /**
     * The world this renderer sees
     * @type World
     */
    world = null;

    /**
     * The camera representing this renderer
     * @type Camera
     */
    camera= null;

    /**
     * Constructs a renderer
     * @param {Camera} camera the camera to use for rendering
     * @param {World} world the world to render
     */
    constructor(camera, world) {
        Object.assign(this, { camera, world });

    }

    /**
     * Renders this world given the context
     * @param context the drawing context
     */
    render(context) {
        // clear raster
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        let worldToCamera = MatrixOp.inverse(this.camera.matrix);
        for (let pane of this.world.panes) {
            let paneToCamera = MatrixOp.multiply(worldToCamera, pane.matrix);

            for (let drawable of pane.drawables) {
                let entityMatrix = MatrixOp.multiply(paneToCamera, drawable.matrix);

                // if on or behind camera...
                if (entityMatrix.get(2, 3) >= 0) continue;


                // scale is given by X1 and Y2, ignore Z1...3
                // position is given by C1 and C2, ignore C3
                toRaster(entityMatrix, this.camera);

                let x = entityMatrix.get(0, 3);
                let y = entityMatrix.get(1, 3);
                let scaleX = entityMatrix.get(0, 0);
                let scaleY = entityMatrix.get(1, 1);


                let p = drawable.drawingProperties;
                let position = p.spritesheet.get(p.row, p.col);

                context.drawImage(
                    p.spritesheet.image,
                    position.x, position.y,
                    p.spritesheet.width, p.spritesheet.height,
                    x, y,
                    p.spritesheet.width * scaleX, p.spritesheet.height * scaleY
                );
            }
        }
    }
}

/**
 * Class that represents a world that can be "rendered."
 *
 * @author Roman Bureacov
 */
class World {
    /**
     * The list of panes in the viewable world
     * @type {[Pane]}
     */
    panes = []

    /**
     * Constructs a world
     */
    constructor() {

    }

    /**
     * Adds a pane to this world
     * @param {Pane} pane the pane to be added
     */
    addPane(pane) {
        this.panes.push(pane);
    }

}

/**
 * Converts the matrix from camera space into raster space.
 *
 * In addition, sets the perspective division in the X1 and Y2 positions
 *
 * @param {Matrix} matrix the matrix representing something in camera space
 * @param {Camera} camera the camera this that views what the matrix represents
 */
const toRaster = (matrix, camera) => {

    let z = matrix.get(2, 3);
    // convert to screen space, perspective divide

    // near plane = 1
    matrix.set(0, 3, matrix.get(0, 3) / -z);
    matrix.set(1, 3, matrix.get(1, 3) / -z);

    // perspective divide the scale
    matrix.set(0, 0, matrix.get(0, 0) / -z);
    matrix.set(1, 1, matrix.get(1, 1) / -z);

    // now in screen space, we can ignore the Z-coordinate

    // convert into NDC
    // normally this would map to [-1, 1], such as below:
    // x = 2 * screen.x / ( r - l) - ( r + l ) / ( r - l )
    // y = 2 * screen.y / ( t - b) - ( t + b ) / ( t - b )
    // but we aren't a GPU, so we can take some liberty and normalize the coordinates to [0, 1]:
    // x = (x - l) / (r - l)
    // y = (y - b) / (t - b)
    let c = camera.canvas;

    let x = matrix.get(0, 3)
    let NDCX = (x - c.left) / (c.right - c.left);

    let y = matrix.get(1, 3)
    let NDCY = (y - c.bottom) / (c.top - c.bottom);

    // convert into raster space
    let rasterX = NDCX * camera.image.width;
    let rasterY = (1 - NDCY) * camera.image.height; // Y axis in reverse
    matrix.set(0, 3, rasterX);
    matrix.set(1, 3, rasterY);

}

export { Pane, Camera, Render, World, Drawable }