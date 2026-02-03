/**
 * Class representing a token for making arenas
 * @author Roman Bureacov
 */
export class Token {

    /**
     * The token types
     * @enum
     */
    static TYPES = Object.freeze({
        NUMBER : "<number>",
        TEXT : "<text>",
        DIMENSION : "Dimension",
        SET : "Set",
        COLN : ":",
        PIPE : "|",
        PERIOD : ".",
        BY : "By",
        LETTER : "<letter>",
        MATRIX : "Matrix",
        SIZE : "Size",
        ARENA : "Arena",
        ROWS : "Rows",
        COLS : "Columns",
        END : "End",
        ORIGIN : "origin",
        COMMA : ",",
        MINS : "-",
    })

    /**
     * Constructs a token for the parser to use
     * @param {string} type the token type
     * @param {string} image the token image
     * @param {number} line the line the token was found at
     */
    constructor(type, image, line) {
        Object.assign(this, {type, image, line})
    }
}