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
        EOF : "<EOF>",

        ORIGIN : "Origin",

        SET : "Set",
        BACKDROP: "backdrop",
        MUSIC: "music",

        MATRIX : "Matrix",
        SIZE : "Size",
        BY : "By",
        END : "End",
        ROWS : "Rows",
        COLS : "Columns",
        DEPTH : "Depth",

        DEFAULT : "Default",
        AUTO : "Auto",
        TILES : "Tiles",
        SAME : "same",

        MAP : "map",

        ARENA : "Arena",
        FOREGROUND : "Foreground",
        BACKGROUND : "Background",

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