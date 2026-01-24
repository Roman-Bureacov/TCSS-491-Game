/*
Rendering code, however not a full renderer.

This code is to represent a 3D camera in a not-so-3D world.

The system has renderable objects, `Drawable`s, which provide the means
on where to draw themselves as well as.
 */

import { Matrix, MatrixOp } from "../../Matrix/Matrix.js";

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

class Drawable extends SpaceObject {

    /**
     * The dimension of the image representing this object
     * @type {{width: number, height: number}}
     */
    imageDimension = {width: 0, height: 0}

    constructor(imageWidth, imageHeight) {
        super();

        this.imageDimension.width = imageWidth;
        this.imageDimension.height = imageHeight;
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
 * @author Roman Bureacov
 */
class Camera extends SpaceObject {

    /**
     * The focal length for this camera, defined in millimeters
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
     * The canvas which this camera sees
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
        let worldToCamera = MatrixOp.inverse(this.camera.matrix);
        for (let pane of this.world.panes) {
            let objectToCamera = MatrixOp.multiply(worldToCamera, pane.matrix);

            for (let drawable of pane.drawables) {
                console.log("Matrix mult");
                console.log("object to camera");
                console.log(objectToCamera);
                console.log("drawable:");
                console.log(drawable.matrix);
                let object = MatrixOp.multiply(objectToCamera, drawable.matrix);
                console.log("before raster");
                console.log(object);

                // if on or behind camera...
                if (object.get(2, 3) >= 0) continue;
                console.log("now transforming...")

                // scale is given by X1 and Y2, ignore Z1...3
                toRaster(object, this.camera);

                let x = object.get(0, 3);
                let y = object.get(1, 3);
                context.beginPath();
                context.lineWidth = 5;
                context.moveTo(x, y);
                context.lineTo(x + 25, y + 25);
                context.stroke();
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
    console.log(matrix);

    let z = matrix.get(3, 3);
    // convert to screen space, perspective divide

    // near plane = 1
    matrix.set(0, 3, matrix.get(0, 3) / -z);
    matrix.set(1, 3, matrix.get(1, 3) / -z);
    // now in screen space, we can ignore the Z-coordinate

    // convert into NDC
    // x = 2 * screen.x / ( r - l) - ( r + l ) / ( r - l )
    let c = camera.canvas;

    console.log("before NDC: ");
    console.log(matrix);
    let x = matrix.get(0, 3)
    matrix.set(0, 3,
        2 * x / (c.right - c.left) - (c.right + c.left) / (c.right - c.left)
        )

    // y = 2 * screen.y / ( t - b) - ( t + b ) / ( t - b )
    let y = matrix.get(1, 3)
    matrix.set(1, 3,
        2 * y / (c.top - c.bottom) - (c.top + c.bottom) / (c.top - c.bottom)
    )
    console.log("after NDC: ");
    console.log(matrix);

    // convert into raster space
    let NDCX = matrix.get(0, 3);
    let NDCY = matrix.get(1, 3);
    matrix.set(0, 3, (NDCX + 1) / 2 * camera.image.width);
    matrix.set(1, 3, (1 - NDCY) / 2 * camera.image.height); // Y axis in reverse
}

export { Pane, Camera, Render, World, Drawable }