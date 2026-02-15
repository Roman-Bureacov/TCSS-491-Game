import test from "node:test";
import { strictEqual, notStrictEqual } from "node:assert/strict";
import {Hitbox, HitboxOp} from "../Game/engine/hitbox.js";
import {Rectangle2D} from "../Game/engine/primitives.js";
import {SpaceObject} from "../Game/engine/render/Render.js";
import {MatrixOp} from "../Matrix/Matrix.js";

const parent = new SpaceObject();

/**
 * Creates a hitbox at x and y with dimension 1 x 1
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @return {Hitbox} the
 */
const make = (x, y) => {
    return new Hitbox(parent, new Rectangle2D(x, y, 1, 1))
}

const intersectFalseString = "h1 intersect h2 is not false";
const intersectTrueString = "h1 intersect h2 is not true";

test("two touching non-overlapping hitboxes", () => {
    let h1 = make(0, 0,);
    let h2 = make(1, 0);

    let points = [
        // note that the edges do touch, but 
        // they aren't counted as "overlapping"
        [-1, 1], [0, 1], [1, 1],
        [-1, 0],         [1, 0],
        [-1,-1], [0,-1], [1,-1]
    ]

    for (let point of points) {
        h2.bounds.setStart(point[0], point[1]);
        strictEqual(h1.intersects(h2), undefined, intersectFalseString);
    }
})

test("two non-overlapping hitboxes", () => {
    let h1 = make(0, 0,);
    let h2 = make(1, 0);

    let points = [
        [-2, 2], [0, 2], [2, 2],
        [-2, 0],         [2, 0],
        [-2,-2], [0,-2], [2,-2]
    ]

    for (let point of points) {
        h2.bounds.setStart(point[0], point[1]);
        strictEqual(h1.intersects(h2), undefined, intersectFalseString);
    }
})

test("two overlapping hitboxes", () => {
    let h1 = make(0, 0);
    let h2 = make(0, 0);

    let points = [
        [-0.5, 0.5], [0, 0.5], [0.5, 0.5],
        [-0.5,   0],           [0.5,   0],
        [-0.5,-0.5], [0,-0.5], [0.5,-0.5]
    ]

    for (let point of points) {
        h2.bounds.setStart(point[0], point[1]);
        notStrictEqual(h1.intersects(h2), undefined, intersectTrueString);
    }
})

test("two hitboxes not overlapping due to different origins", () => {
    let h1 = make(0,0);
    let h2 = make(0,0);

    h2.parent = new SpaceObject();

    h1.parent.setObjectPosition(1, 1, 0);

    strictEqual(h1.intersects(h2), undefined, intersectFalseString)
})

test("two hitboxes overlapping despite different origins", () => {
    let h1 = make(0,0);
    let h2 = make(0,0);

    h2.parent = new SpaceObject();

    h1.parent.setObjectPosition(1, 1, 0);
    h1.bounds.setStart(-1, -1);

    notStrictEqual(h1.intersects(h2), undefined, intersectTrueString)
})

test("two overlapping hitboxes sending messages", () => {
    let h1 = make(0,0);
    let h2 = make(0,0);
    let flag1 = 0;
    let flag2 = 0;

    h1.resolveIntersection = (prop) => {
        if (prop.other.parent === h2.parent) flag1++;
    }

    h2.resolveIntersection = (prop) => {
        if (prop.other.parent === h1.parent) {
            prop.other.resolveIntersection(prop);
            flag2++;
        }
    }

    let p;
    p = h1.intersects(h2);
    h1.resolveIntersection(p)
    strictEqual(flag1, 1, "h1 did nothing on intersection with h2");
    p = h2.intersects(h1);
    h2.resolveIntersection(p);
    strictEqual(flag1, 2, "h2 did nothing on intersection with h1");
    strictEqual(flag2, 1, "h2 did nothing on intersection with h1");
})

/**
 * expect the hitbox to be located at some x and y
 * @param {number} atX expected x coordinate
 * @param {number} atY expected y coordinate
 * @param {Hitbox} hitbox hitbox to test
 */
const expectAt = (atX, atY, hitbox) => {
    let actualOrigin = MatrixOp.multiply(hitbox.parent.transform, hitbox.bounds.start);
    let actualX = actualOrigin.get(0, 0);
    let actualY = actualOrigin.get(1, 0);
    strictEqual(atX, actualX,
        `expected to find hitbox at
        (${atX}, ${atY})
        but found hitbox at 
        (${actualX}, ${actualY}) 
        `
    )
    strictEqual(atY, actualY,
        `expected to find hitbox at
        (${atX}, ${atY})
        but found hitbox at 
        (${actualX}, ${actualY}) 
        `
    )
}

/**
 * tests the points to see if overlaps occurred and hitboxes were separated
 * @param {Hitbox} h1 the moving hitbox
 * @param {Hitbox} h2 the immovable hitbox
 * @param {[Number, Number][]} points the points to move h1 to
 * @param {[Number, Number][]} expectedPoints the expected origin of h1 after the separation
 */
const testPoints = (h1, h2, points, expectedPoints) => {
    h2.resolveIntersection = (prop) => {
        HitboxOp.separate(prop);
    }

    for (let i in points) {
        h2.parent.setObjectPosition(points[i][0], points[i][1], 0);
        let p = h2.intersects(h1);
        notStrictEqual(p, undefined, "expected intersection but got undefined (no intersection found)")

        h2.resolveIntersection(p);

        strictEqual(h1.parent.objectX(), 0, "h1 moved on X when it shouldn't have");
        strictEqual(h1.parent.objectY(), 0, "h1 moved on Y when it shouldn't have");
        strictEqual(h1.parent.objectZ(), 0, "h1 moved on Z when it shouldn't have");
        strictEqual(h2.intersects(h1), undefined, intersectFalseString);
        strictEqual(h1.intersects(h2), undefined, intersectFalseString);
        expectAt(expectedPoints[i][0], expectedPoints[i][1], h2);
    }
}

test("two overlapping hitboxes being separated", () => {
    let h1 = make(0, 0);
    let h2 = make(0, 0);
    h2.parent = new SpaceObject();

    let points = [
        [-0.5,  0.5], [-0.25,  0.5], [0, 0.5], [0.25, 0.5], [0.5,  0.5],
        [-0.5, 0.25],                                       [0.5, 0.25],
        [-0.5,    0],                                       [0.5,    0],
        [-0.5,-0.25],                                       [0.5,-0.25],
        [-0.5, -0.5], [-0.25, -0.5], [0,-0.5], [0.25,-0.5], [0.5, -0.5]
    ];

    let expectedPoints = [
        [-0.5,    1], [-0.25,    1], [0,   1], [0.25,   1], [0.5,    1],
        [  -1, 0.25],                                       [  1, 0.25],
        [  -1,    0],                                       [  1,    0],
        [  -1,-0.25],                                       [  1,-0.25],
        [-0.5,   -1], [-0.25,   -1], [0,  -1], [0.25,  -1], [0.5,   -1]
    ]

    h2.resolveIntersection = (prop) => {
        HitboxOp.separate(prop);
    }

    for (let i in points) {
        h2.parent.setObjectPosition(points[i][0], points[i][1], 0);
        let p = h2.intersects(h1);
        notStrictEqual(p, undefined, "expected intersection but got undefined (no intersection found)")

        h2.resolveIntersection(p);

        strictEqual(h1.parent.objectX(), 0, "h1 moved on X when it shouldn't have");
        strictEqual(h1.parent.objectY(), 0, "h1 moved on Y when it shouldn't have");
        strictEqual(h1.parent.objectZ(), 0, "h1 moved on Z when it shouldn't have");
        strictEqual(h2.intersects(h1), undefined, intersectFalseString);
        strictEqual(h1.intersects(h2), undefined, intersectFalseString);
        expectAt(expectedPoints[i][0], expectedPoints[i][1], h2);
    }
})

test("two overlapping hitboxes being separated, using the bias", () => {
    let h1 = make(0, 0);
    let h2 = make(0, 0);
    h2.parent = new SpaceObject();

    let points = [
        [-0.75, 0.75], [ -0.5,  0.5], [0, 0.5], [ 0.5, 0.5], [0.75, 0.75],
        [-0.75,  0.5],                                       [0.75,  0.5],
        [-0.75,    0],                                       [0.75,    0],
        [-0.75, -0.5],                                       [0.75, -0.5],
        [-0.75,-0.75], [ -0.5, -0.5], [0,-0.5], [ 0.5,-0.5], [0.75,-0.75]
    ];

    let expectedPoints = [
        [-0.75,   1], [ -0.5,    1], [0,   1], [ 0.5,   1], [ 0.75,   1],
        [   -1, 0.5],                                       [    1, 0.5],
        [   -1,   0],                                       [    1,   0],
        [   -1,-0.5],                                       [    1,-0.5],
        [-0.75,  -1], [ -0.5,   -1], [0,  -1], [ 0.5,  -1], [ 0.75,  -1]
    ]

    h2.resolveIntersection = (prop) => {
        HitboxOp.separate(prop);
    }

    for (let i in points) {
        h2.parent.setObjectPosition(points[i][0], points[i][1], 0);
        let p = h2.intersects(h1);
        notStrictEqual(p, undefined, "expected intersection but got undefined (no intersection found)")

        h2.resolveIntersection(p);

        strictEqual(h1.parent.objectX(), 0, "h1 moved on X when it shouldn't have");
        strictEqual(h1.parent.objectY(), 0, "h1 moved on Y when it shouldn't have");
        strictEqual(h1.parent.objectZ(), 0, "h1 moved on Z when it shouldn't have");
        strictEqual(h2.intersects(h1), undefined, intersectFalseString);
        strictEqual(h1.intersects(h2), undefined, intersectFalseString);
        expectAt(expectedPoints[i][0], expectedPoints[i][1], h2);
    }
})

test("two overlapping hitboxes being separated, using the bias, where one hitbox is tall", () => {
    let h1 = make(0, 0);
    let h2 = make(0, 0);
    h2.parent = new SpaceObject();
    h2.bounds.setDimension(1, 2);

    let points = [
        [-0.8,  1.7], [ -0.6,  1.7], [0.6, 1.7], [0.8,  1.7],
        [-0.8,  1.3],                            [0.8,  1.3],
        [-0.8,  0.5],                            [0.8,  0.5],
        [-0.8, -0.2],                            [0.8, -0.2],
        [-0.8, -0.7], [ -0.6, -0.7], [0.6,-0.7], [0.8, -0.7]
    ];

    let expectedPoints = [
        [  -1,  1.7], [ -0.6,    2], [0.6,   2], [  1,  1.7],
        [  -1,  1.3],                            [  1,  1.3],
        [  -1,  0.5],                            [  1,  0.5],
        [  -1, -0.2],                            [  1, -0.2],
        [  -1, -0.7], [ -0.6,   -1], [0.6,  -1], [  1, -0.7]
    ];

    testPoints(h1, h2, points, expectedPoints)
})