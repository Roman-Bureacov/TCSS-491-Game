import {Matrix} from "../Matrix/Matrix.js";
import {GameEngine} from "./gameengine.js"
import {AssetManager} from "./assetmanager.js";
import {ArenaFactory} from "./arenaFactory.js";
import {loadArenaTxt} from "./arenaFactory.js";
import {parseTxtToMap} from "./arenaFactory.js";
import {TileMap} from "./arenaFactory.js";
import {AwesomeCharacter} from "./assets/sprites/character/awesome_character.js";
import {AwesomeCharacter2} from "./assets/sprites/character/awesome_character2.js";

const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const CANVAS = document.querySelector('#gameWorld');

let guy1Img = "../img/Guy.png";
let guy1;
let guy2Img = "./assets/sprites/character/guy2/Guy2.png";
let guy2;
/**
 * Arena maps and assets
 */
const arenas = {
    arena1: {
        tileSet: "./assets/tileset/Industrial Tileset/1_Industrial_Tileset_1B.png",
        background: "./assets/background/background02.jpeg",
        map: "./assets/maps/arena01.txt",
        name: "arena01",
        tileWidth: 32, // The width of the tile Set tiles
        tileHeight: 32, // The height of the tile set tiles.
        legend: {
            "<": 0, // left platform piece
            "#": 1, // center platform piece
            ">": 2, // right platform piece

            "!": 3, // Single platform piece

            "/": 6, // left Floor piece
            "_": 7, // center floor piece
            "\\": 8, // right floor piece
            " ": -1, // Spaces
        },
        lp: [35, 354, 353], //left platform [left most, right most, y value]
        cp: [356, 703, 515],//center platform [left most, right most, y value]
        rp: [705, 990, 353], // right platform [left most, right most, y value]
        floor: 737, // The y-value of the floor.
    },
    // Add more arenas assets here
    arena2: {
        tileSet: "./assets/tileset/Industrial Tileset/1_Industrial_Tileset_1.png",
        background: "./assets/background/background01.jpeg",
        map: "./assets/maps/arena02.txt",
        name: "arena02",
        tileWidth: 32, // The width of the tile Set tiles
        tileHeight: 32, // The height of the tile set tiles.
        legend: {
            "<": 0, // left platform piece
            "#": 1, // center platform piece
            ">": 2, // right platform piece

            "!": 3, // Single platform piece

            "/": 6, // left Floor piece
            "_": 7, // center floor piece
            "\\": 8, // right floor piece
            " ": -1, // Spaces
        },
        lp: [], //left platform [left most, right most, y value]
        cp: [],//center platform [left most, right most, y value]
        rp: [], // right platform [left most, right most, y value]
        floor: 737, // The y-value of the floor.
        playerOnePos : [120, 13],
        playerTwoPos: [760, 13],
    }
}

export const global = {
    CANVAS_W: CANVAS.width,
    CANVAS_H: CANVAS.height,
    arenas: arenas,
}


ASSET_MANAGER.queueDownload(guy1Img);
ASSET_MANAGER.queueDownload(guy2Img);

ASSET_MANAGER.downloadAll(async () => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    canvas.tabIndex = 1;
    canvas.focus();

    //Arena1
    const arena1TileMap = await setArenaAssets(arenas.arena2);


    guy1 = new AwesomeCharacter(gameEngine, ASSET_MANAGER.getAsset(guy1Img), arenas.arena2.playerOnePos[0], arenas.arena2.playerOnePos[1]);
    
    guy2 = new AwesomeCharacter2(gameEngine, ASSET_MANAGER.getAsset(guy2Img), arenas.arena2.playerTwoPos[0], arenas.arena2.playerTwoPos[1]);

    gameEngine.init(ctx);

    //Add new Arenas/sprite entities.
    gameEngine.addEntity(arena1TileMap);

    gameEngine.addEntity(guy1);
    gameEngine.addEntity(guy2);

    // Start the gameEngine
    gameEngine.start();
});

/**
 * Sets a new promise to resolve the tileSetImg path
 * @param theTileSetPath The path to the tile sheet
 * @param theTileSetImg a new TileSetImage
 * @returns {Promise<String>} the path of the tile sheet.
 */
function setTileSetPromise(theTileSetPath, theTileSetImg) {
    return new Promise((resolve, reject) => {
        theTileSetImg.onload = () => resolve(theTileSetImg);
        theTileSetImg.onerror = () => reject(new Error("Tileset failed to load: " + theTileSetPath));
        theTileSetImg.src = theTileSetPath;
    });
}

/**
 * Sets the promise and map text
 * Used to keep the assetManager clutter-free
 *
 * @param tileset The tileset path
 * @param map The mapText file path
 * @returns {(Promise<String>|Promise<*>)[]} A List with the promise and map text path.
 */
function setPromiseAndLoadArenaText(tileset, map) {
    return [setTileSetPromise(tileset, new Image()), loadArenaTxt(map)]
}

/**
 * Sets the tileMap Object
 * @param theTileSheet The arenas tileSheet
 * @param theArenasBackground The path to the arenas background.
 * @param theArenaName the Arenas String name
 * @param theMapText the Map Text Path
 * @param theTileWidth
 * @param theTileHeight
 * @param theArenaLegend the arenas Legend Object
 * @returns {TileMap} a new TileMap Object.
 */
function setTileMap(theTileSheet, theMapText, theArenasBackground, theArenaName, theTileWidth, theTileHeight, theArenaLegend) {
    const col = global.CANVAS_W / theTileWidth;
    const row = global.CANVAS_H / theTileHeight;
    const factory = new ArenaFactory(theTileSheet, theArenasBackground, theArenaName, theTileWidth, theTileHeight, ASSET_MANAGER, gameEngine, global.CANVAS_W, global.CANVAS_H);
    const buildMap = parseTxtToMap(theMapText, col, row, theArenaLegend);
    return new TileMap(factory, buildMap);
}

/**
 * Builds the arena
 *
 * @param arenaObj The arena object
 * @returns {Promise<TileMap>} a returned promise of the tiled map of the arena.
 */
async function setArenaAssets(arenaObj) {
    let arenaTilesetSheet, arenaMapTxt;
    [arenaTilesetSheet, arenaMapTxt] = await Promise.all(setPromiseAndLoadArenaText(arenaObj.tileSet, arenaObj.map));

    return setTileMap(arenaTilesetSheet, arenaMapTxt, arenaObj.background, arenaObj.name, arenaObj.tileWidth, arenaObj.tileHeight, arenaObj.legend)
}