import {Matrix} from "../../Matrix/Matrix.js";

/**
 * This class represents points in 3D space. Points themselves are nothing more
 * than 4x1 column vectors, therefore this is a convenience class for handling
 * points in 3D space represented by 4x1 matrices.
 *
 * @author Roman Bureacov
 */
export class Point extends Matrix {

    /**
     * Constructs a point
     * @param {number} [initX=0]
     * @param {number} [initY=0]
     * @param {number} [initZ=0]
     */
    constructor(initX = 0, initY = 0, initZ = 0) {
        super(4, 1);
        this.set(0, 0, initX);
        this.set(1, 0, initY);
        this.set(2, 0, initZ);
        this.set(3, 0, 1); // homogenous coordinates
    }

    /**
     * Gets the x-coordinate of this point
     * @return {number} the x-coordinate
     */
    x() { return this.get(0, 0) }

    /**
     * Gets the y-coordinate of this point
     * @return {number} the y-coordinate
     */
    y() { return this.get(1, 0) }

    /**
     * Gets the z-coordinate of this point
     * @return {number}
     */
    z() { return this.get(2, 0) }

    /**
     * Sets the x-coordinate of this point
     * @param {number} value the new x-coordinate
     */
    setX(value) { this.set(0, 0, value) }


    /**
     * Sets the y-coordinate of this point
     * @param {number} value the new y-coordinate
     */
    setY(value) { this.set(1, 0, value) }


    /**
     * Sets the z-coordinate of this point
     * @param {number} value the new z-coordinate
     */
    setZ(value) { this.set(2, 0, value) }
}

/**
 * This class defines some rectangle in 3D space, constructed by defining its start
 * and its end. All rectangles are axis-aligned and defined starting with the origin
 * at the top-left.
 *
 * Rectangles are drawn on the xy plane
 *
 * @author Roman Bureacov
 */
export class Rectangle2D {

    /**
     * The starting point of this rectangle
     * @type {Point}
     */
    start;

    /**
     * The end point of this rectangle, defined as extending
     * down and to the right
     * @type {Point}
     */
    end;

    /**
     * The dimension of this rectangle. Note that this is merely a fact-sheet
     * @type {Readonly<{width: number, height: number}>}
     */
    dimension ;

    /**
     * Creates a rectangle
     * @param {number} [startX=0] the origin X of this rectangle
     * @param {number} [startY=0] the origin Y of this rectangle
     * @param {number} [dimX=0] the width of this rectangle
     * defined as extending from the origin X to the positive X
     * @param {number} [dimY=0] the height of this rectangle
     * defined as extending from the origin Y to the negative Y
     */
    constructor(startX, startY, dimX, dimY) {
        this.start = new Point(startX, startY);
        this.end = new Point();
        this.setDimension(dimX, dimY);
    }

    /**
     * Sets the start for this rectangle, preserving dimension
     * @param {number} [x=0] the new X coordinate
     * @param {number} [y=0] the new Y coordinate
     */
    setStart(x=0, y=0) {
        this.start.setX(x);
        this.start.setY(y);
        this.setDimension(
            this.dimension.width,
            this.dimension.height,
        );
    }

    /**
     * Sets the dimension of this rectangle
     * @param {number} dimX the positive dimension in the positive X direction
     * @param {number} dimY the positive dimension in the negative Y direction
     */
    setDimension(dimX, dimY) {
        this.end.setX(this.start.x() + dimX)
        this.end.setY(this.start.y() - dimY)
        this.dimension = Object.freeze({
            width: dimX,
            height: dimY,
        })
    }

    /**
     * Sets the dimension of this rectangle using the aspect ratio
     * @param {number} dimX the positive dimension in the positive X direction
     * @param {number} aspect the aspect ratio
     */
    setDimensionAspect(dimX, aspect) {
        this.setDimension(dimX, dimX * (1 / aspect));
    }

}