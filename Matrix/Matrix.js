/*
This file represents basic matrix operations.

Roman Bureacov
 */

/**
 * Creates and returns an identity matrix.
 * @param {number} dimension the dimension of the matrix
 * @returns {Matrix} the identity matrix
 */
const identity = (dimension) => {
    let m = new Matrix(dimension);
    for (let i = 0; i < dimension; i++) m.set(i, i, 1);
    return m;
}

/**
 * Performs matrix multiplication, returning a new matrix.
 *
 * @param {Matrix} L the left matrix
 * @param {Matrix} R the right matrix
 * @return {Matrix | undefined} undefined if the multiplication is impossible, resulting matrix otherwise.
 */
const multiply = (L, R) => {
    if (L.columns !== R.rows) return undefined;

    const m = new Matrix(L.rows, R.columns)

    for (let r = 0; r < L.rows; r++) {
        for (let c = 0; c < R.columns; c++) {
            let sum = 0;
            for (let i = 0; i < L.columns; i++) {
                sum += L.get(r, i) * R.get(i, c);
            }
            m.set(r, c, sum)
        }
    }

    return m;
}


/**
 * Finds the determinant of the matrix
 * @param {Matrix} M the matrix
 * @returns {number|null} null if the matrix is not square, the determinant otherwise
 */
const determinant = (M) => {
    if (M.rows !== M.columns) return null;

    if (M.rows === 1) {
        return M.get(0, 0);
    } else if (M.rows === 2) {
        return M.get(0, 0) * M.get(1, 1) - M.get(0, 1) * M.get(1, 0);
    } else {
        let determinant = 0;
        for (let c = 0; c < M.columns; c++) {
            determinant += M.get(0, c) * cofactor(M, 0, c);
        }
        return determinant;
    }
}

/**
 * Finds the cofactor of the matrix
 * @param {Matrix} M the matrix
 * @param {number} row the row index
 * @param {number} column the column index
 * @returns {number|null} null if the matrix is non-square, the cofactor otherwise
 */
const cofactor = (M, row, column) => {
    if (M.rows !== M.columns) return null;

    let minor = new Matrix(M.rows - 1, M.columns - 1);
    for (let r = 0, rMinor = 0; r < M.rows; r++) {
        if (r !== row) {
            for (let c = 0, cMinor = 0; c < M.columns; c++) {
                if (c !== column) {
                    minor.set(rMinor, cMinor, M.get(r, c));
                    cMinor++;
                }
            }
            rMinor++;
        }
    }

    return Math.pow(-1, row + column) * determinant(minor);
}

/**
 * Calculates the inverse of the matrix
 * @param {Matrix} M
 * @return null if the matrix is singular, the inverse of the matrix otherwise
 */
const inverse = (M) => {
    if (M.rows !== M.columns) return null;

    let dimension = M.rows;

    // find the inverse using the adjoint
    // A^-1 = 1/det(A) * adj(A) when det(A) != 0
    // adj(A) returns the adjoint matrix is the transpose of the cofactor matrix of each term
    const inverse = new Matrix(dimension);

    for (let r = 0; r < dimension; r++) {
        for (let c = 0; c < dimension; c++) {
            inverse.set(r, c, cofactor(M, c, r));
        }
    }

    let determinant = 0;
    for (let c = 0; c < dimension; c++) {
        determinant += M.get(0, c) * inverse.get(c, 0);
    }

    if (determinant === 0) return null;

    inverse.matrix.forEach(e => e / determinant);

    return inverse;
}

/**
 * Class that represents a matrix.
 *
 * Matrix indices are 0-indexed.
 *
 * @author Roman Bureacov
 */
export class Matrix {
    /**
     * Creates a matrix of specified size with all entries 0
     * @param {number} rows the number of rows in the matrix
     * @param {number=rows} columns the number of columns in the matrix
     */
    constructor(rows, columns = rows) {
        Object.assign(this, {
            rows, columns
        });

        this.matrix = []
        for (let i = 0; i < rows * columns; i++) {
            this.matrix[i] = 0;
        }
    }

    /**
     * Sets the value at the position.
     *
     * If the indices are out of bounds, nothing happens.
     *
     * @param {number} row the row to look at
     * @param {number} col the column to look at
     * @param {*} value the value to set
     */
    set(row, col, value) {
        if (this.matrix[row * this.columns + col] !== undefined)
            this.matrix[row * this.columns + col] = value;
    }

    /**
     * Gets the value at the position.
     * @param {number} row the row to look at
     * @param {number} col the column to look at
     * @returns {*} the value at the point in the matrix
     */
    get(row, col) {
        return this.matrix[row * this.columns + col];
    }

    /**
     * Duplicates and returns a copy of this matrix.
     * @returns {Matrix} the copy
     */
    duplicate() {
        let m = new Matrix(this.rows, this.columns);
        this.matrix.map( (v, i) => m.matrix[i] = v);
        return m
    }
}


/**
 * Object that represents matrix operations.
 *
 * @author Roman Bureacov
 */
export const MatrixOp = { multiply, determinant, cofactor, inverse, identity }