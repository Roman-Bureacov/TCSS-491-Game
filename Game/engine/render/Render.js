/*
Rendering code, however not a full renderer.

This code is to represent a 3D camera in a not-so-3D world.

The system has renderable objects, `Drawable`s, which provide the means
on where to draw themselves as well as.
 */

import {Matrix, MatrixOp} from "../../../Matrix/Matrix.js";
import {Rectangle2D} from "../primitives.js";
import {DrawingProperties} from "./drawing.js";

/**
 * An object in world space.
 *
 * Objects themselves only encode a coordinate system, and
 * additional properties are defined with respect to said local
 * coordinate system.
 *
 * @author Roman Bureacov
 */
class SpaceObject {

    /**
     * The 4x4 matrix representing this object
     * @type {Matrix}
     */
    transform;

    constructor() {
        this.transform = MatrixOp.identity(4);
    }

    /**
     * Sets the position for this space object in the world
     * @param {number} [x] the x position, object x if undefined
     * @param {number} [y] the y position, object y if undefined
     * @param {number} [z] the z position, object z if undefined
     */
    setObjectPosition(x = undefined, y = undefined, z = undefined) {
        if (x !== undefined) this.transform.set(0, 3, x);
        if (y !== undefined) this.transform.set(1, 3, y);
        if (z !== undefined) this.transform.set(2, 3, z);
    }

    /**
     * Sets the scale for this space object in the world
     * @param {number} [dimX] the x scale, object scale x if undefined
     * @param {number} [dimY] the y scale, object scale y if undefined
     * @param {number} [dimZ] the z scale, object scale z if undefined
     */
    setObjectScale(dimX = undefined, dimY = undefined, dimZ = undefined) {
        if (dimX !== undefined) this.transform.set(0, 0, dimX);
        if (dimY !== undefined) this.transform.set(1, 1, dimX);
        if (dimZ !== undefined) this.transform.set(2, 2, dimX);
    }

    /**
     * Gets the X position of this space object in the world
     * @returns {number}
     */
    objectX() {
        return this.transform.get(0, 3);
    }

    /**
     * Gets the Y position of this object in the world
     * @returns {number}
     */
    objectY() {
        return this.transform.get(1, 3);
    }

    /**
     * Gets the Z position of this object in the world
     * @returns {number}
     */
    objectZ() {
        return this.transform.get(2, 3);
    }
}


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
    drawingProperties;

    /**
     * Creates a new drawable
     * @param {Spritesheet} spritesheet the spritesheet representing this object
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     */
    constructor(spritesheet, dimX = 1, dimY = 1) {
        super(dimX, dimY);
        Object.assign(this, { spritesheet });
        this.drawingProperties = new DrawingProperties(
            spritesheet,
            new Rectangle2D(0, 0, dimX, dimY))
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
     * @type {Drawable[]}
     */
    drawables = []

    constructor() {
        super();

    }

    /**
     * Appends drawable entities to this pane
     * @param {...Drawable} drawables the drawable(s)
     */
    addDrawable(...drawables) {
        drawables.map(drawable => this.drawables.push(drawable))
    }

}

/**
 * @typedef CameraCanvas the coordinates of the camera canvas
 * @property {number} left the left coordinate of the camera canvas
 * @property {number} right the right coordinate of the camera canvas
 * @property {number} top the top coordinate of the camera canvas
 * @property {number} bottom the bottom coordinate of the camera canvas
 */

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
     * the conversion rate of millimeters per pixel.
     *
     * The purpose of this is to make the aperture dimensions dependent
     * on the image dimensions. If you make the aperture dimensions
     * independent of the image (either the width or height, or both)
     * you may get a squishing effect, where one of the canvas
     * coordinates (left and right, or top and bottom) don't change
     * yet as you change the image dimensions, the points map
     * to a proportional amount of the raster, which is what you do not
     * want.
     *
     * The effect of independent aperture is that of being only able to
     * change one dimension, and yet the other dimension changes freely,
     * so the mapping is just wrong.
     *
     * For an illustration, see [this](https://www.desmos.com/calculator/e7ihqkk6yz)
     * and move around the image dimensions.
     *
     * @type {number}
     */
    static #MM_PER_PIXELS = 22/1000;

    /**
     * The focal length for this camera, defined in millimeters.
     *
     * The focal length may be modified using `setFocalLength`.
     *
     * @type {number}
     */
    focalLength = 10;

    /**
     * The image for this camera, defined in pixels
     *
     * The image may be modified using `setImage`
     * @type {{width: number, height: number, aspect: number}}
     */
    image;

    /**
     * The aperture for this camera, defined in millimeters.
     *
     * The aperture may be modified using `setAperture`
     * @type {{width: number, height: number, aspect: number}}
     */
    aperture;

    /**
     * The canvas which this camera sees.
     *
     * If the camera's aperture parameters, or focal length, change, reassign this canvas
     * using the static method for computing the canvas coordinates.
     *
     * @type CameraCanvas
     */
    #canvas = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }

    /**
     * If the camera properties have been modified.
     * @type {boolean} true if a property (other than position) has been changed, false otherwise
     */
    #modified;

    /**
     * Constructs the camera with necessary parameters
     * @param imageWidth the image width
     * @param imageHeight the image height
     */
    constructor(imageWidth, imageHeight) {
        super();
        this.image = Object.freeze({
            width: imageWidth,
            height: imageHeight,
            aspect: imageWidth / imageHeight,
        });

        // for simplicity, both have the same aspect ratio in this project's context
        this.setAperture(imageWidth * Camera.#MM_PER_PIXELS, this.image.aspect, undefined);

        this.#modified = true;
    }

    /**
     * Tells the camera to look at the specific coordinate with respect to
     * the world origin
     *
     * @param {number} x the x coordinate with respect to the world origin
     * @param {number} y the y coordinate with respect to the world origin
     */
    lookAt(x, y) {
        this.transform.set(0, 3, x);
        this.transform.set(1, 3, y);
    }

    /**
     * Sets the depth of this camera in the world.
     *
     * @param {number} z the depth of this camera
     */
    setDepth(z) {
        this.transform.set(2, 3, z);
    }

    /**
     * Sets focal length and recomputes the canvas coordinates
     * @param focalLength the new focal length in millimeters
     */
    setFocalLength(focalLength) {
        this.focalLength = focalLength;
        this.#modified = true;
    }

    /**
     * Sets the aperture for this camera.
     *
     * If the aspect ratio is omitted (undefined) but the height is defined,
     * the aspect ratio will be inferred.
     *
     * If the height is omitted (undefined) but the aspect ratio is defined,
     * the height will be inferred.
     *
     * @param {number} width the width of the aperture in millimeters
     * @param {number} [aspect=undefined] the aspect ratio of the aperture
     * @param {number} [height=undefined] the height of the aperture
     */
    setAperture(width, aspect=undefined, height=undefined) {
        if (!aspect) {
            if (!height) throw new Error("aspect and height undefined when setting aperture");

            aspect = width/height;
        } else if (!height) {
            height = width * (1.0/aspect);
        }

        this.aperture = Object.freeze({
            width: width,
            height: height,
            aspect: aspect,
        })

        this.#modified = true;
    }

    /**
     * Calculates the camera's canvas coordinates
     * @returns {CameraCanvas} the immutable canvas coordinates
     */
    getCanvas() {

        if (this.#modified) {
            // for simplicity, near plane is 1: apertureHeight / focal * nearPlaneZ
            const canvasHeight =  this.aperture.height / this.focalLength;

            this.#canvas.top = (canvasHeight) / 2.0;
            this.#canvas.bottom = -this.#canvas.top;
            this.#canvas.right = this.#canvas.top * this.aperture.aspect;
            this.#canvas.left = -this.#canvas.right;

            this.#modified = false;
        }
        
        return this.#canvas;
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

        let worldToCamera = MatrixOp.inverse(this.camera.transform);
        for (let pane of this.world.panes) {
            // panes are defined with respect to the world
            
            let paneToCamera = MatrixOp.multiply(worldToCamera, pane.transform);
            
            for (let drawable of pane.drawables) {
                if (drawable.drawingProperties.hidden) continue;

                let entityToCamera = MatrixOp.multiply(paneToCamera, drawable.transform);

                // if on or behind camera... (z-check)
                if (entityToCamera.get(2, 3) >= 0) continue;

                let startpoint = MatrixOp.multiply(entityToCamera, drawable.drawingProperties.bounds.start);
                let endpoint = MatrixOp.multiply(entityToCamera, drawable.drawingProperties.bounds.end);

                Render.#toRasterCoordinates(startpoint, this.camera); // now working with matrices
                Render.#toRasterCoordinates(endpoint, this.camera); // now working with matrices

                // is the entity x y minimum in bounds?
                let img = this.camera.image;
                if (
                    img.width < startpoint.get(0, 0)
                    || img.height < startpoint.get(1, 0)
                ) continue;

                // is the entity x y maximum in bounds?
                if (
                    endpoint.get(0, 0) < 0
                    || endpoint.get(1, 0) < 0
                ) continue;

                // note that the bounds check is valid even for reversed entities:
                // even if it were reversed, it would be testing the same dimensions
                // at the same point

                let x = startpoint.get(0, 0);
                let y = startpoint.get(1, 0);
                let width = endpoint.get(0, 0) - x;
                let height = endpoint.get(1, 0) - y;

                let prop = drawable.drawingProperties;
                let position = prop.spritesheet.get(prop.spriteRow, prop.spriteCol);

                if (drawable.drawingProperties.isReversed) {
                    context.save();

                    context.scale(-1, 1);

                    context.drawImage(
                        prop.spritesheet.image,
                        position.x, position.y,
                        prop.spritesheet.frameWidth, prop.spritesheet.frameHeight,
                        -x - width, y,
                        width, height
                    );

                    context.restore();
                } else {
                    context.drawImage(
                        prop.spritesheet.image,
                        position.x, position.y,
                        prop.spritesheet.frameWidth, prop.spritesheet.frameHeight,
                        x, y,
                        width, height
                    );
                }

            }
        }
    }

    /**
     * Converts the column vector from camera space into raster space
     * @param {Matrix} matrix the column vector
     * @param {Camera} camera the camera that views the point
     */
    static #toRasterCoordinates(matrix, camera) {
        // perspective divide with z near plane = 1
        let z = matrix.get(2, 0);

        matrix.set(0, 0, matrix.get(0, 0) / -z);
        matrix.set(1, 0, matrix.get(1, 0) / -z);

        // convert to NDC
        let c = camera.getCanvas();

        let x = matrix.get(0, 0)
        let NDCX = (x - c.left) / (c.right - c.left);

        let y = matrix.get(1, 0)
        let NDCY = (y - c.bottom) / (c.top - c.bottom);

        // convert into raster space
        let rasterX = NDCX * camera.image.width;
        let rasterY = (1 - NDCY) * camera.image.height; // Y axis in reverse
        matrix.set(0, 0, rasterX);
        matrix.set(1, 0, rasterY);
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
     * @type {Pane[]}
     */
    panes = []

    /**
     * Constructs a world
     */
    constructor() {

    }

    /**
     * Adds panes to this world
     * @param {...Pane} panes the pane(s) to add
     */
    addPane(... panes) {
        panes.map(pane => this.panes.push(pane));
    }

}

export { Pane, Camera, Render, World, Drawable, SpaceObject }