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
    matrix;

    constructor() {
        this.matrix = MatrixOp.identity(4);
    }

    /**
     * Transforms this object
     * @param {Matrix} transformation the matrix to transform by
     */
    transform = (transformation) =>
        this.matrix = MatrixOp.multiply(this.matrix, transformation) ;


}

/**
 * Represents an entity in 2D space that has a width and height.
 *
 * All drawables are entities, but not all entities are drawable, such as hitboxes.
 *
 * Entities have positive dimensions and have origins starting from the top-left
 *
 * @author Roman Bureacov
 */
class Entity extends SpaceObject {

    /**
     * A 4x1 column vector representing the scale of this space object.
     *
     * The scale is represented at a point with respect to this object's origin.
     * @type {Matrix}
     */
    _dimension = new Matrix(4, 1);

    /**
     * Constructs an entity of the dimension
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     */
    constructor(dimX = 1, dimY = 1) {
        super();
        this.matrix.set(1, 1, -1); // for drawing and scaling, invert Y
        this._dimension.set(0, 3, 1); // homogenous coordinates
        this.setDimension(dimX, dimY);
    }

    /**
     * Sets the dimension of this entity
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     */
    setDimension(dimX= 1, dimY = 1) {
        this._dimension.set(0, 0, dimX);
        this._dimension.set(1, 0, dimY);
    }

    /**
     * Sets the dimension of this entity using aspect ratio
     * @param {number} dimX the positive x dimension of this entity
     * @param {number} aspect the aspect ratio of the dimension of this entity
     */
    setDimensionAspect(dimX, aspect) {
        this.setDimension(dimX, dimX * aspect);
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
class Drawable extends Entity {

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
     * @param {number} [dimX=1] the positive x dimension of this entity
     * @param {number} [dimY=1] the positive y dimension of this entity
     */
    constructor(spritesheet, dimX = 1, dimY = 1) {
        super(dimX, dimY);
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
        this.setAperture(22, this.image.aspect, undefined);

        
        this.#modified = true;
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
    }

    /**
     * Calculates the camera's canvas coordinates
     * @returns {CameraCanvas} the immutable canvas coordinates
     */
    getCanvas() {

        if (this.#modified) {
            // for simplicity, near plane is 1: aperatureWidth / focal * nearPlaneZ
            const canvasWidth =  this.aperture.width / this.focalLength;

            this.#canvas.left = -canvasWidth / 2;
            this.#canvas.right = -this.#canvas.left;
            this.#canvas.top = canvasWidth / 2 * this.aperture.aspect;
            this.#canvas.bottom = -this.#canvas.top;
            
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

                        let worldToCamera = MatrixOp.inverse(this.camera.matrix);
                for (let pane of this.world.panes) {
            // panes are defined with respect to the world
            
            let paneToCamera = MatrixOp.multiply(worldToCamera, pane.matrix);
            
            for (let drawable of pane.drawables) {
                let entityMatrix = MatrixOp.multiply(paneToCamera, drawable.matrix);

                // if on or behind camera...
                if (entityMatrix.get(2, 3) >= 0) continue;

                let endpoint = MatrixOp.multiply(entityMatrix, drawable._dimension);

                // position is given by C1 and C2, ignore C3
                Render.#toRasterMatrix(entityMatrix, this.camera);
                Render.#toRasterPoint(endpoint, this.camera);

                let x = entityMatrix.get(0, 3);
                let y = entityMatrix.get(1, 3);
                let endX = endpoint.get(0, 0);
                let endY = endpoint.get(1, 0);

                
                let p = drawable.drawingProperties;
                let position = p.spritesheet.get(p.row, p.col);

                context.drawImage(
                    p.spritesheet.image,
                    position.x, position.y,
                    p.spritesheet.width, p.spritesheet.height,
                    x, y,
                    endX - x, endY - y
                );
            }
        }
    }

    /**
     * Converts the column vector from camera space into raster space
     * @param {Matrix} matrix the column vector
     * @param {Camera} camera the camera that views the point
     */
    static #toRasterPoint(matrix, camera) {
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

    /**
     * Converts the matrix from camera space into raster space.
     *
     * In addition, sets the perspective division in the X1 and Y2 positions
     *
     * @param {Matrix} matrix the matrix representing something in camera space
     * @param {Camera} camera the camera that views what the matrix represents
     */
    static #toRasterMatrix = (matrix, camera) => {

        // convert to screen space, perspective divide
        let z = matrix.get(2, 3);

        // near plane = 1
        matrix.set(0, 3, matrix.get(0, 3) / -z);
        matrix.set(1, 3, matrix.get(1, 3) / -z);

        // now in screen space, we can ignore the Z-coordinate

        // convert into NDC
        // normally this would map to [-1, 1], such as below:
        // x = 2 * screen.x / ( r - l) - ( r + l ) / ( r - l )
        // y = 2 * screen.y / ( t - b) - ( t + b ) / ( t - b )
        // but we aren't a GPU, so we can take some liberty and normalize the coordinates to [0, 1]:
        // x = (x - l) / (r - l)
        // y = (y - b) / (t - b)
        let c = camera.getCanvas();

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

export { Pane, Camera, Render, World, Drawable, Entity }