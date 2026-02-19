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
        LETTER : "<letter>",
        STR : "\"<any>\"",

        COLN : "Colon",
        PIPE : "Pipe",
        DOT : "Dot",
        COMMA : "Comma",
        MINS : "Minus",
        ASTR : "Asterisk",

        BY : "By",
        ORIGIN : "Origin",

        SET : "Set",

        MATRIX : "Matrix",
        SIZE : "Size",
        ARENA : "Arena",
        END : "End",
        ROWS : "Rows",
        COLS : "Columns",
        DIMENSION : "Dimension",

        DEFAULT : "Default",
        AUTO : "Auto",
        TILES : "Tiles",

        DETAIL: "detail",
        BACKGROUND: "background",
        MUSIC: "music",
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