import {Matrix} from "../../../Matrix/Matrix.js";
import {TileFactory} from "../tileFactory.js";
import {ArenaScanner} from "./arenaScanner.js";
import {Token} from "./Token.js";

/**
 * The parser for building arenas based on text
 *
 * @Roman Bureacov
 */
export class ArenaParser {

    /**
     * The working parameters of this parser.
     * @type {Object}
     */
    parameters = {
        set : undefined,
        rows : undefined,
        columns : undefined,
        width : undefined,
        height : undefined,
        originX : undefined,
        originY : undefined,
    }

    /**
     * @type {Token}
     */
    token;

    /**
     * The built arena
     * @type StaticEntity[]
     */
    compiledArena = [];

    /**
     * Constructs a new arena parser
     * @param {string} tileset the tileset name
     * @param {string} text the text to parse
     */
    constructor(tileset, text) {
        Object.assign(this, {tileset});
        this.scanner = new ArenaScanner(text);
    }

    /**
     * Builds an arena based on text
     *
     * @return {StaticEntity[]} the set of tiles representing the arena
     */
    buildArena() {
        this.root();

        return this.compiledArena;
    }

    /**
     * Read the root symbol
     */
    root() {
        this.specifiers();
        this.arena();
    }

    /**
     * Read the specifiers
     */
    specifiers() {
        this.setSpecifier();
        this.dimensionSpecifier();
    }

    /**
     * Read the tileset specifier
     */
    setSpecifier() {
        this.mustBe(Token.TYPES.SET);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.TEXT);
        this.parameters.set = this.token.image;
    }

    /**
     * Read the dimension specifier
     */
    dimensionSpecifier() {
        this.mustBe(Token.TYPES.DIMENSION);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.PIPE);
        this.originSpecifier();
        this.mustBe(Token.TYPES.PIPE);
        this.matrixSpecifier();
        this.mustBe(Token.TYPES.PIPE);
        this.worldSpecifier();
    }

    /**
     * Read the origin specifier
     */
    originSpecifier() {
        this.mustBe(Token.TYPES.ORIGIN);
        this.mustBe(Token.TYPES.COLN);

        let sign ;

        this.next();
        if (this.have(Token.TYPES.MINS)) sign = -1;
        else sign = 1;
        this.mustBe(Token.TYPES.NUMBER)
        this.parameters.originX = sign * parseInt(this.token.image);

        this.next();
        if (this.have(Token.TYPES.MINS)) sign = -1;
        else sign = 1;
        this.mustBe(Token.TYPES.NUMBER)
        this.parameters.originY = sign * parseInt(this.token.image);

    }

    /**
     * Read the matrix specifier
     */
    matrixSpecifier() {
        this.mustBe(Token.TYPES.MATRIX);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.NUMBER);
        this.parameters.rows = parseInt(this.token.image);
        this.mustBe(Token.TYPES.ROWS);
        this.mustBe(Token.TYPES.BY);
        this.mustBe(Token.TYPES.NUMBER);
        this.parameters.columns = parseInt(this.token.image);
        this.mustBe(Token.TYPES.COLS);

    }

    /**
     * Read the world dimension specifier
     */
    worldSpecifier() {
        this.mustBe(Token.TYPES.SIZE);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.NUMBER);
        this.parameters.width = parseInt(this.token.image);
        this.mustBe(Token.TYPES.BY);
        this.mustBe(Token.TYPES.NUMBER);
        this.parameters.height = parseInt(this.token.image);
    }

    /**
     * Read the arena
     */
    arena() {
        this.mustBe(Token.TYPES.ARENA);
        this.mustBe(Token.TYPES.COLN);

        console.log(this.parameters)
        // we now have enough information to build the arena
        let rowSpacing = (1.0 * this.parameters.height) / this.parameters.rows;
        let colSpacing = (1.0 * this.parameters.width) / this.parameters.columns;
        for (let r = 0; r < this.parameters.rows; r++) {
            for (let c = 0; c < this.parameters.columns; c++) {
                this.next();
                if (this.have(Token.TYPES.LETTER)) {
                    let tile = (
                        TileFactory.makeTile(
                            this.parameters.set,
                            this.token.image
                        )
                    );

                    tile.setObjectPosition(
                        this.parameters.originX + c * colSpacing,
                        this.parameters.originY - r * rowSpacing,  0);

                    this.compiledArena.push(tile);
                } else {
                    this.mustBe(Token.TYPES.PERIOD, true);
                }
            }
        }

        this.mustBe(Token.TYPES.END);

    }

    // helpers
    /**
     * expects the token type from the scanner
     * @param {string} type
     * @param {boolean} [readCurrent=false] if to evaluate the current token
     */
    mustBe(type, readCurrent=false) {
        if (!readCurrent) this.next();
        if (this.token.type !== type)
            throw new Error(
                `(line ${this.token.line}) 
                Expected token type ${type} 
                but found type ${this.token.type} (${this.token.image})`)
    }


    /**
     * Queries if the current token is of the type
     * @param {string} type the type
     * @return {boolean} if the token read is of the type
     */
    have(type) {
        return this.token.type === type;
    }

    /**
     * Advances parsing by reading the next token
     */
    next() {
        this.token = this.scanner.next();
    }


}