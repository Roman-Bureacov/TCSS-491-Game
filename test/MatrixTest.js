import test from "node:test";
import {strictEqual} from "node:assert/strict";
import {Matrix, MatrixOp} from "../Matrix/Matrix.js";

/**
 * Fills a matrix with incrementing values 1-9
 * @param M the matrix to fill
 */
const fillMatrix = (M) => {
    for (let i = 0; i < M.matrix.length; i++) {
        M.matrix[i] = (i % 9) + 1;
    }
}

/**
 * tests if two numerical values are approximately the same (for floating-point values)
 * @param A value
 * @param B value
 * @returns {boolean} if they're close enough
 */
let approx = (A, B) => {
    return (Math.abs(A - B) < 10e-6);
};

test("Make the identity matrix", () => {
    let dimension = 4;

    let actual = MatrixOp.identity(dimension);
    for (let r = 0; r < dimension; r++) {
        for (let c = 0; c < dimension; c++) {
            if (r === c) {
                strictEqual(actual.get(r, c), 1, `test at row ${r} and col ${c}`);
            } else {
                strictEqual(actual.get(r, c), 0, `test at row ${r} and col ${c}`);
            }
        }
    }
})

test("Matrix creation", () => {

    let m = new Matrix(2, 5);
    let i = 0;
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 5; c++) {
            m.set(r, c, i++);
        }
    }

    i = 0;
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 5; c++) {
            strictEqual(m.get(r, c), i++, `test at row ${r} and col ${c}`);
        }
    }
})

test("Matrix multiplication, 3x3 with a 3x1", () => {
    let l = new Matrix(3, 3);
    let r = new Matrix(3, 1);

    fillMatrix(l)
    fillMatrix(r)

    let m = MatrixOp.multiply(l, r);

    strictEqual(m.rows, 3);
    strictEqual(m.columns, 1);

    strictEqual(m.get(0, 0), 14);
    strictEqual(m.get(1, 0), 32);
    strictEqual(m.get(2, 0), 50);

})

test("Matrix multiplication, 4x4 with a 4x4", () => {
    let l = new Matrix(4, 4);
    let r = new Matrix(4, 4);

    // fill 1-9
    fillMatrix(l)

    // fill 9-1
    for (let i = 0, j = 8; i < r.matrix.length; i++, j--) {
        r.matrix[i] = (() => {
            if (j >= 0) return j + 1;
            else return (j = 8) + 1;
        })();
    }

    let m = MatrixOp.multiply(l, r);

    strictEqual(m.rows, 4);
    strictEqual(m.columns, 4);

    // row 0
    strictEqual(m.get(0, 0), 46);
    strictEqual(m.get(0, 1), 63);
    strictEqual(m.get(0, 2), 53);
    strictEqual(m.get(0, 3), 43);
    
    // row 1
    strictEqual(m.get(1, 0), 130);
    strictEqual(m.get(1, 1), 167);
    strictEqual(m.get(1, 2), 141);
    strictEqual(m.get(1, 3), 115);
    
    // row 2
    strictEqual(m.get(2, 0), 106);
    strictEqual(m.get(2, 1), 109);
    strictEqual(m.get(2, 2), 94);
    strictEqual(m.get(2, 3), 79);
    
    // row 3
    strictEqual(m.get(3, 0), 109);
    strictEqual(m.get(3, 1), 141);
    strictEqual(m.get(3, 2), 119);
    strictEqual(m.get(3, 3), 97);
})

test("Matrix multiplication, failure with a 3x1 and a 3x3", () => {
    let l = new Matrix(3, 1);
    let r = new Matrix(3, 3);

    fillMatrix(l);
    fillMatrix(r);

    strictEqual(MatrixOp.multiply(l, r), undefined);
})

test("Matrix inversion of a 3x3 matrix", () => {
    let m = new Matrix(3);

    m.set(0, 0, 5);
    m.set(0, 1, 7);
    m.set(0, 2, 4);

    m.set(1, 0, 3);
    m.set(1, 1, 5);
    m.set(1, 2, 3);

    m.set(2, 0, 5);
    m.set(2, 1, 8);
    m.set(2, 2, 5);
    
    let inverse = MatrixOp.inverse(m);

    strictEqual(approx(inverse.get(0, 0), 1), true);
    strictEqual(approx(inverse.get(0, 1), -3), true);
    strictEqual(approx(inverse.get(0, 2), 1), true);
    
    strictEqual(approx(inverse.get(1, 0), 0), true);
    strictEqual(approx(inverse.get(1, 1), 5), true);
    strictEqual(approx(inverse.get(1, 2), -3), true);

    strictEqual(approx(inverse.get(2, 0), -1), true);
    strictEqual(approx(inverse.get(2, 1), -5), true);
    strictEqual(approx(inverse.get(2, 2), 4), true);
})

test("Matrix inversion of a 4x4 matrix", () => {
    let m = new Matrix(4);
    
    m.set(0, 0, 4);
    m.set(0, 1, 9);
    m.set(0, 2, 4);
    m.set(0, 3, 2);

    m.set(1, 0, 2);
    m.set(1, 1, 5);
    m.set(1, 2, 2);
    m.set(1, 3, 1);

    m.set(2, 0, 3);
    m.set(2, 1, 9);
    m.set(2, 2, 4);
    m.set(2, 3, 1);

    m.set(3, 0, 3);
    m.set(3, 1, 7);
    m.set(3, 2, 3);
    m.set(3, 3, 2);
    
    let inverse = MatrixOp.inverse(m);

    strictEqual(approx(inverse.get(0, 0), 2), true);
    strictEqual(approx(inverse.get(0, 1), 1), true);
    strictEqual(approx(inverse.get(0, 2), -1), true);
    strictEqual(approx(inverse.get(0, 3), -2), true);

    strictEqual(approx(inverse.get(1, 0), -1), true);
    strictEqual(approx(inverse.get(1, 1), 2), true);
    strictEqual(approx(inverse.get(1, 2), 0), true);
    strictEqual(approx(inverse.get(1, 3), 0), true);

    strictEqual(approx(inverse.get(2, 0), 1), true);
    strictEqual(approx(inverse.get(2, 1), -5), true);
    strictEqual(approx(inverse.get(2, 2), 1), true);
    strictEqual(approx(inverse.get(2, 3), 1), true);

    strictEqual(approx(inverse.get(3, 0), -1), true);
    strictEqual(approx(inverse.get(3, 1), -1), true);
    strictEqual(approx(inverse.get(3, 2), 0), true);
    strictEqual(approx(inverse.get(3, 3), 2), true);
    
})