import {TileFactory} from "../tileFactory.js";
import {ArenaScanner} from "./arenaScanner.js";
import {Token} from "./Token.js";
import {StaticEntity} from "../../entity/entity.js";
import {Spritesheet} from "../../entity/animation.js";
import {AssetManager} from "../../assets/assetmanager.js";


/**
 * @typedef ArenaProperties an object representing what the arena has
 * @property {{x: number, y: number}} [playerAStart] the starting position of a player
 * @property {{x: number, y: number}} [playerBStart] the starting position of a player
 * @property {TileEntity[]} tiles the list of tiles in this arena
 * @property {StaticEntity} background the background static entity
 * @property {string} music the music name for this arena
 */

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
        tileWidth : undefined,
        tileHeight : undefined,
    }

    /**
     * The arena properties to return
     * @type {ArenaProperties}
     */
    arenaProps;

    /**
     * @type {Token}
     */
    token;

    /**
     * The previous token, for lookahead functionality
     * @type {Token}
     */
    previous;

    /**
     * Constructs a new arena parser
     * @param {string} text the text to parse
     */
    constructor(text) {
        this.scanner = new ArenaScanner(text);

        this.arenaProps = {
            playerAStart: {
                x: undefined,
                y: undefined,
            },
            playerBStart: {
                x: undefined,
                y: undefined,
            },
            tiles: undefined,
            background: undefined,
            music: undefined,
        }
    }

    /**
     * Builds an arena based on text
     *
     * @return {ArenaProperties} the properties pertaining to the arena
     */
    buildArena() {
        this.root();

        return this.arenaProps;
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
        this.arenaDetailSpecifier();
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
        this.mustBe(Token.TYPES.PIPE);
        this.tileSpecifier();
    }

    /**
     * Read the origin specifier
     */
    originSpecifier() {
        this.mustBe(Token.TYPES.ORIGIN);
        this.mustBe(Token.TYPES.COLN);

        let sign;
        if (this.have(Token.TYPES.MINS)) sign = -1;
        else sign = 1;
        this.mustBe(Token.TYPES.NUMBER)
        this.parameters.originX = sign * parseFloat(this.token.image);

        this.mustBe(Token.TYPES.COMMA)

        if (this.have(Token.TYPES.MINS)) sign = -1;
        else sign = 1;
        this.mustBe(Token.TYPES.NUMBER)
        this.parameters.originY = sign * parseFloat(this.token.image);

    }

    arenaDetailSpecifier() {
        this.mustBe(Token.TYPES.DETAIL);
        this.mustBe(Token.TYPES.COLN);

        this.mustBe(Token.TYPES.PIPE);
        this.mustBe(Token.TYPES.BACKGROUND);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.STR)
        // build this tile
        let path = this.token.image.replaceAll("\"", "");

        let asset = AssetManager.getAsset(path)
        if (asset === undefined) throw new Error(`
Could not fetch asset "${path}"
on line ${this.token.line}
`
        );

        let spritesheet = new Spritesheet(asset, 1, 1);

        this.arenaProps.background = new StaticEntity(
            spritesheet,
            spritesheet.image.width,
            spritesheet.image.height
        );

        this.mustBe(Token.TYPES.PIPE);
        this.mustBe(Token.TYPES.MUSIC);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.STR)
        // make this string
        path = this.token.image.replaceAll("\"", "");
        // TODO: is there a way to make sure this file exists considering it is loaded outside of AssetManager?
        // TODO: error check?
        this.arenaProps.music = path;
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
        const size = this.sizeSpecific();
        this.parameters.width = size[0];
        this.parameters.height = size[1];
    }

    /**
     * Read the tile size specifier
     */
    tileSpecifier() {
        this.mustBe(Token.TYPES.TILES);
        this.mustBe(Token.TYPES.COLN);
        let size = [];
        if (this.have(Token.TYPES.AUTO)) {
            size[0] = this.parameters.width / this.parameters.columns;
            size[1] = this.parameters.height / this.parameters.rows;
        } else if (this.see(Token.TYPES.NUMBER)) {
            size = this.sizeSpecific();
        } else {
            this.mustBe(Token.TYPES.DEFAULT)
            size = [1, 1];
        }

        this.parameters.tileWidth = size[0];
        this.parameters.tileHeight = size[1];
    }


    /**
     * reads a size specifier
     * @return {[first: number, second: number]} the size specified
     */
    sizeSpecific() {
        let size = [];

        this.mustBe(Token.TYPES.NUMBER);
        size.push(parseFloat(this.token.image))

        this.mustBe(Token.TYPES.BY);

        this.mustBe(Token.TYPES.NUMBER);
        size.push(parseFloat(this.token.image));

        return size;
    }

    /**
     * Read the arena
     */
    arena() {
        this.mustBe(Token.TYPES.ARENA);
        this.mustBe(Token.TYPES.COLN);

        console.log(this.parameters)
        let compiledArena = [];
        // we now have enough information to build the arena
        let rowSpacing = (1.0 * this.parameters.height) / this.parameters.rows;
        let colSpacing = (1.0 * this.parameters.width) / this.parameters.columns;
        for (let r = 0; r < this.parameters.rows; r++) {
            for (let c = 0; c < this.parameters.columns; c++) {
                if (this.have(Token.TYPES.LETTER)) {
                    let tile = (
                        TileFactory.makeTile(
                            this.parameters.set,
                            this.token.image
                        )
                    );

                    tile.setObjectPosition(
                        this.parameters.originX + c * colSpacing,
                        this.parameters.originY - r * rowSpacing,
                        0
                    );
                    tile.drawingProperties.bounds.setDimension(
                        this.parameters.tileWidth,
                        this.parameters.tileHeight
                    );
                    tile.hitbox.bounds.setDimension(
                        this.parameters.tileWidth,
                        this.parameters.tileHeight
                    );

                    compiledArena.push(tile);
                } else {
                    this.mustBe(Token.TYPES.DOT);
                }
            }
        }

        this.mustBe(Token.TYPES.END);

        this.arenaProps.tiles = compiledArena;

    }

    // --- helpers


    /**
     * Consumes the next token expects the token type from the scanner
     * @param {string} type
     * @throws {Error} if the token was not of the type sought
     */
    mustBe(type) {

        let lookingAt;

        if (this.previous) {
            lookingAt = this.previous;
            this.previous = undefined;
        } else {
            this.next();
            lookingAt = this.token;
        }

        if (lookingAt.type !== type)
            throw new Error(
                `(line ${this.token.line} of arena file)
                Expected token type ${type} 
                but found type ${this.token.type} (${this.token.image})`)
    }

    /**
     * Scans the next token, only consuming it if it was of the type sought
     * @param {string} type the type
     * @return {boolean} if the token read is of the type
     */
    have(type) {
        if (!this.previous) { // if not defined, get next
            this.next();
            this.previous = this.token;
        }

        let have = this.previous.type === type;

        if (have) this.previous = undefined;

        return have;
    }

    /**
     * Scans the next token and asks if the token is of the type specified
     * @param {string} type
     * @return {boolean} if the token was of the type
     */
    see(type) {
        if (!this.previous) {
            this.next();
            this.previous = this.token;
        }

        return this.previous.type === type;
    }

    /**
     * Advances parsing by reading the next token
     */
    next() {
        this.token = this.scanner.next();
    }


}