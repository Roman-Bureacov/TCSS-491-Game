import { Matrix } from "../Matrix/Matrix.js";
import { GameEngine } from "./gameengine.js"
import { AssetManager } from "./assetmanager.js";
import {AwesomeCharacter} from "./character/awesome_character.js";

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager()

let img = "../img/Guy.png";
ASSET_MANAGER.queueDownload(img);

var char;

const TILE_SIZE = 32;

const CANVAS_W = 1024; // TODO: get from DOM
const CANVAS_H = 768; // TODO: get from DOM

const COLS = CANVAS_W / TILE_SIZE;
const ROWS = CANVAS_H / TILE_SIZE

const arenas = {
    arena1: {
        tileSet: "./assets/tileset/Industrial Tileset/1_Industrial_Tileset_1B.png",
        map: "./assets/maps/arena01.txt",
        legend: {
            "<": 0, // left platform piece
            "#": 1, // center platform piece
            ">": 2, // right platform piece

            "!": 3, // Single platform piece

            "/": 6, // left Floor piece
            "_": 7, // center floor piece
            "\\": 8, // right floor piece
            " ": -1, // Spaces
        }
    },
    // Add more arenas assets here
}


ASSET_MANAGER.downloadAll(async () => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    canvas.tabIndex = 1;
    canvas.focus();
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    //Arena1
    let arena1TilesetSheet, arena1MapTxt;
    [arena1TilesetSheet, arena1MapTxt] = await Promise.all(setPromiseAndLoadArenaText(arenas.arena1.tileSet, arenas.arena1.map));
    const arena1TileMap = setTileMap(arena1TilesetSheet, "arena01", arena1MapTxt, arenas.arena1.legend)


	char = new AwesomeCharacter(gameEngine, ASSET_MANAGER.getAsset(img));
	gameEngine.addEntity(char);

	gameEngine.init(ctx);

    //Add new Arenas sprite entities.
    gameEngine.addEntity(arena1TileMap);

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
 * @param theArenaName the Arenas String name
 * @param theMapText the Map Text Path
 * @param theArenaLegend the arenas Legend Object
 * @returns {TileMap} a new TileMap Object.
 */
function setTileMap(theTileSheet, theArenaName, theMapText, theArenaLegend) {
    const factory = new ArenaFactory(theTileSheet, theArenaName);
    const buildMap = parseTxtToMap(theMapText, COLS, ROWS, theArenaLegend);
    return new TileMap(factory, buildMap, COLS, ROWS);
}

