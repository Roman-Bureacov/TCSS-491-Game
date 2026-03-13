import {TileFactory} from "../tileFactory.js";
import {ArenaScanner} from "./arenaScanner.js";
import {Token} from "./Token.js";
import {StaticEntity} from "../../entity/entity.js";
import {Spritesheet} from "../../entity/animation.js";
import {AssetManager} from "../../assets/assetmanager.js";


/**
 * @typedef ArenaProperties an object representing what the arena has
 * @property {{x: number | undefined, y: number | undefined}} playerAStart the starting position of a player
 * @property {{x: number | undefined, y: number | undefined}} playerBStart the starting position of a player
 * @property {{tiles: StaticEntity[], depth: number}} [foreground] the scenic foreground tiles
 * @property {{tiles: StaticEntity[], depth: number}} [background] the scenic background tiles
 * @property {TileEntity[]} tiles the list of tiles in this arena
 * @property {StaticEntity} [backdrop] the backdrop static entity
 * @property {string} [music] the music name for this arena
 */

/**
 * @typedef mapProperties an object representing a map and its properties
 * @property {string} mapName the name of the map
 * @property {number} rows the number of tile rows in this map
 * @property {number} columns the number of tile columns in this map
 * @property {number} width the width in space the tiles consume
 * @property {number} height the height in space the tiles consume
 * @property {number} originX where the tiles start placing
 * @property {number} originY where the tiles start placing
 * @property {number} tileWidth the width of each tile
 * @property {number} tileHeight the width of each tile
 * @property {number} depth the depth of the map in space
 * @property {TileEntity[]} tiles the collection of tiles in this map
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
        /** @type mapProperties */
        arena : {
            mapName : "arena",
            rows : undefined,
            columns : undefined,
            width : undefined,
            height : undefined,
            originX : undefined,
            originY : undefined,
            tileWidth : undefined,
            tileHeight : undefined,
            depth: undefined,
            tiles: undefined,
        },
        /** @type mapProperties */
        foreground : {
            mapName : "foreground",
            rows : undefined,
            columns : undefined,
            width : undefined,
            height : undefined,
            originX : undefined,
            originY : undefined,
            tileWidth : undefined,
            tileHeight : undefined,
            depth: undefined,
            tiles: undefined,
        },
        /** @type mapProperties */
        background : {
            mapName : "background",
            rows : undefined,
            columns : undefined,
            width : undefined,
            height : undefined,
            originX : undefined,
            originY : undefined,
            tileWidth : undefined,
            tileHeight : undefined,
            depth: undefined,
            tiles: undefined,
        }
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
            background: {
                tiles: undefined,
                depth: undefined
            },
            foreground: {
                tiles: undefined,
                depth: undefined
            },
            tiles: undefined,
            backdrop: undefined,
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

        this.arenaProps.tiles = this.parameters.arena.tiles;
        this.arenaProps.background.tiles = this.parameters.background.tiles;
        this.arenaProps.background.depth = this.parameters.background.depth;
        this.arenaProps.foreground.tiles = this.parameters.foreground.tiles;
        this.arenaProps.foreground.depth = this.parameters.foreground.depth;
        return this.arenaProps;
    }

    /**
     * Read the root symbol
     */
    root() {
        this.metaSpecifiers();
        this.mapSpecifiers();
    }

    /**
     * Read the specifiers
     */
    metaSpecifiers() {
        this.setSpecifier();
        if (this.see(Token.TYPES.BACKDROP)) this.backdropSpecifier();
        if (this.see(Token.TYPES.MUSIC)) this.musicSpecifier();
    }
    
    /**
     * Read the tileset specifier
     */
    setSpecifier() {
        this.mustBe(Token.TYPES.SET);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.STR);
        this.parameters.set = ArenaParser.stripQuotes(this.token.image);
    }
    
    musicSpecifier() {
        this.mustBe(Token.TYPES.MUSIC);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.STR);
        
        // make this string
        let path = ArenaParser.stripQuotes(this.token.image);
        // TODO: is there a way to make sure this file exists considering it is loaded outside of AssetManager?
        // TODO: error check?
        this.arenaProps.music = path;
    }
    
    backdropSpecifier() {
        this.mustBe(Token.TYPES.BACKDROP);
        this.mustBe(Token.TYPES.COLN);
        this.mustBe(Token.TYPES.STR);

        // build this tile
        let path = ArenaParser.stripQuotes(this.token.image);

        let asset = AssetManager.getAsset(path)
        if (asset === undefined) throw new Error(`
Could not fetch asset "${path}"
on line ${this.token.line}
`
        );

        let spritesheet = new Spritesheet(asset, 1, 1);

        this.arenaProps.backdrop = new StaticEntity(
            spritesheet,
            spritesheet.image.width,
            spritesheet.image.height
        );
    }

    /**
     * Read the map specifiers
     */
    mapSpecifiers() {
        // we need to guarantee that arena is defined first for us to use `same` later
        if (!this.see(Token.TYPES.ARENA)) this.semanticError(
            `expected arena to be defined first but found "${this.token.image}" instead`)
        
        while (
            this.see(Token.TYPES.ARENA)
            || this.see(Token.TYPES.BACKGROUND)
            || this.see(Token.TYPES.FOREGROUND)
        ) this.mapping()
    }
    
    mapping() {
        let details;
        if (this.have(Token.TYPES.ARENA)) {
            details = this.parameters.arena;
        } else if (this.have(Token.TYPES.BACKGROUND)) {
            details = this.parameters.background;
        } else {
            this.mustBe(Token.TYPES.FOREGROUND);
            details = this.parameters.foreground;
        }
        this.mustBe(Token.TYPES.COLN)
        
        while (this.have(Token.TYPES.PIPE)) this.specifier(details);
    }

    /**
     * reads a specifier
     * @param {mapProperties} context what part to read the specifier into (arena, foreground, or background parameters)
     */
    specifier(context) {
        if (this.see(Token.TYPES.MATRIX)) this.matrixSpecifier(context)
        else if (this.see(Token.TYPES.ORIGIN)) this.originSpecifier(context)
        else if (this.see(Token.TYPES.SIZE)) this.worldSpecifier(context)
        else if (this.see(Token.TYPES.TILES)) this.tileSpecifier(context)
        else if (this.see(Token.TYPES.DEPTH)) this.depthSpecifier(context)
        else {
            this.mapSpecifier(context)
        }
    }
    
    /**
     * Read the origin specifier
     * @param {mapProperties} context what part to read the specifier into (arena, foreground, or background parameters)
     */
    originSpecifier(context) {
        this.mustBe(Token.TYPES.ORIGIN);
        this.mustBe(Token.TYPES.COLN);

        !(Number.isFinite(context.originX))
            || this.semanticError(
            "origin already specified (duplicate specifier or mapping)"
            );
        
        if (this.have(Token.TYPES.SAME)) {
            context.originX = this.parameters.arena.originX;
            context.originY = this.parameters.arena.originY;
        } else {
            let sign;
            if (this.have(Token.TYPES.MINS)) sign = -1;
            else sign = 1;
            this.mustBe(Token.TYPES.NUMBER)
            context.originX = sign * parseFloat(this.token.image);

            this.mustBe(Token.TYPES.COMMA)

            if (this.have(Token.TYPES.MINS)) sign = -1;
            else sign = 1;
            this.mustBe(Token.TYPES.NUMBER)
            context.originY = sign * parseFloat(this.token.image);
        }
    }

    /**
     * Read the matrix specifier
     * @param {mapProperties} context what part to read the specifier into (arena, foreground, or background parameters)
     */
    matrixSpecifier(context) {
        this.mustBe(Token.TYPES.MATRIX);
        this.mustBe(Token.TYPES.COLN);

        !(Number.isFinite(context.rows))
            || this.semanticError(
            "matrix already specified (duplicate specifier or mapping)"
            )
        
        if (this.have(Token.TYPES.SAME)) {
            context.rows = this.parameters.arena.rows;
            context.columns = this.parameters.arena.columns;
        } else {
            this.mustBe(Token.TYPES.NUMBER);
            context.rows = parseInt(this.token.image);
            this.mustBe(Token.TYPES.ROWS);
            this.mustBe(Token.TYPES.BY);
            this.mustBe(Token.TYPES.NUMBER);
            context.columns = parseInt(this.token.image);
            this.mustBe(Token.TYPES.COLS);
        }
    }

    /**
     * Read the world dimension specifier
     * @param {mapProperties} context what part to read the specifier into (arena, foreground, or background parameters)
     */
    worldSpecifier(context) {
        this.mustBe(Token.TYPES.SIZE);
        this.mustBe(Token.TYPES.COLN);

        !(Number.isFinite(context.width))
            || this.semanticError(
            "tile world already specified (duplicate specifier or mapping)"
            );
        
        if (this.have(Token.TYPES.SAME)) {
            context.width = this.parameters.arena.width;
            context.height = this.parameters.arena.height;
        } else {
            const size = this.sizeSpecific();
            context.width = size[0];
            context.height = size[1];
        }
    }

    /**
     * Read the tile size specifier
     * @param {mapProperties} context what part to read the specifier into (arena, foreground, or background parameters)
     */
    tileSpecifier(context) {
        this.mustBe(Token.TYPES.TILES);
        this.mustBe(Token.TYPES.COLN);

        !(Number.isFinite(context.tileWidth))
            || this.semanticError(
            "tile size already specified (duplicate specifier or mapping)"
            );
        
        
        if (this.have(Token.TYPES.SAME)) {
            context.tileWidth = this.parameters.arena.tileWidth;
            context.tileHeight = this.parameters.arena.tileHeight;
        } else {
            Number.isFinite(context.width)
                || this.parserError("Trying to define tile dimensions before defining size width");
            Number.isFinite(context.height)
                || this.parserError("Trying to define tile dimensions before defining size height")
            Number.isFinite(context.rows)
                || this.parserError("Trying to define tile dimensions before defining row count");
            Number.isFinite(context.columns)
                || this.parserError("Trying to define tile dimensions before defining column count");
            
            let size = [];
            if (this.have(Token.TYPES.AUTO)) {
                size[0] = context.width / context.columns;
                size[1] = context.height / context.rows;
            } else if (this.see(Token.TYPES.NUMBER)) {
                size = this.sizeSpecific();
            } else {
                this.mustBe(Token.TYPES.DEFAULT)
                size = [1, 1];
            }

            context.tileWidth = size[0];
            context.tileHeight = size[1];

        }
    }

    /**
     * Read the map depth specifier
     * @param {mapProperties} context what part to read the specifier into (arena, foreground, or background parameters)
     */
    depthSpecifier(context) {
        this.mustBe(Token.TYPES.DEPTH);
        this.mustBe(Token.TYPES.COLN);

        !(Number.isFinite(context.depth))
            || this.semanticError(
            "depth already specified (duplicate specifier or mapping)"
            )
        
        if (this.have(Token.TYPES.SAME)) {
            context.depth = this.parameters.arena.depth;
        } else {
            let sign = (
                this.have(Token.TYPES.MINS)
            ) ? -1 : 1;
            this.mustBe(Token.TYPES.NUMBER)
            let depth = Number.parseFloat(this.token.image)
            context.depth = sign * depth;
        }
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
     * Read the map
     * @param {mapProperties} context what part to read the specifier into (arena, foreground, or background parameters)
     */
    mapSpecifier(context) {
        this.mustBe(Token.TYPES.MAP);
        this.mustBe(Token.TYPES.COLN);

        // is this map well-defined?
        Number.isFinite(context.width) 
            || this.parserError(`size width was left unspecified for ${context.mapName}`);
        Number.isFinite(context.height) 
            || this.parserError(`size height was left unspecified for ${context.mapName}`);
        Number.isFinite(context.tileWidth) 
            || this.parserError(`tile width was left unspecified for ${context.mapName}`);
        Number.isFinite(context.tileHeight) 
            || this.parserError(`tile height was left unspecified for ${context.mapName}`);
        Number.isFinite(context.originX) 
            || this.parserError(`world origin X was left unspecified for ${context.mapName}`);
        Number.isFinite(context.originY) 
            || this.parserError(`world origin Y was left unspecified for ${context.mapName}`);

        let compiledMap = [];
        let player = 1;
        // we now have enough information to build the arena
        let rowSpacing = context.height / context.rows;
        let colSpacing = context.width / context.columns;
        for (let r = 0; r < context.rows; r++) {
            for (let c = 0; c < context.columns; c++) {
                if (this.have(Token.TYPES.LETTER)) {
                    let tile = (
                        TileFactory.makeTile(
                            this.parameters.set,
                            this.token.image
                        )
                    );

                    tile.setObjectPosition(
                        context.originX + c * colSpacing,
                        context.originY - r * rowSpacing,
                        0
                    );
                    tile.drawingProperties.bounds.setDimension(
                        context.tileWidth,
                        context.tileHeight
                    );
                    tile.hitbox.bounds.setDimension(
                        context.tileWidth,
                        context.tileHeight
                    );

                    compiledMap.push(tile);
                } else if (this.have(Token.TYPES.ASTR)) {
                    if (context.mapName !== this.parameters.arena.mapName) {
                        this.semanticError("Tried to specify a player spawn outside of the arena pane")
                    }

                    let startX = context.originX + c * colSpacing;
                    let startY = context.originY - r * rowSpacing;
                    switch (player++) {
                        case 1:
                            this.arenaProps.playerAStart.x = startX;
                            this.arenaProps.playerAStart.y = startY;
                            break;
                        case 2:
                            this.arenaProps.playerBStart.x = startX;
                            this.arenaProps.playerBStart.y = startY;
                            break;
                        default:
                            throw new Error(
`
more than 2 player initial locations defined 
found ${this.token.type} at line ${this.token.line} 
`
                            )
                    }
                } else {
                    this.mustBe(Token.TYPES.DOT);
                }
            }
        }

        this.mustBe(Token.TYPES.END);

        context.tiles = compiledMap;

    }

    // --- helpers

    /**
     * Strips the start and end quotes from the string
     * @param {string} str the string with quotes
     * @return {string} the string without quotes
     */
    static stripQuotes(str) {
        return str.replaceAll("\"", "");
    }

    /**
     * Throws a semantic error from the parser
     * @param {string} what description of the error
     */
    semanticError(what) {
        throw new Error(`Semantic error: ${what}\n(line ${this.token.line})`)
    }

    /**
     * Throws a parser error
     * @param {string} what description of the error
     */
    parserError(what) {
        throw new Error(`Parser error: ${what}\n(line ${this.token.line})`);
    }

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