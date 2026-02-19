import {Matrix} from "../Matrix/Matrix.js";
import {GameEngine} from "./gameengine.js"
import {AssetManager} from "./assetmanager.js";
import {ArenaFactory} from "./arenaFactory.js";
import {loadArenaTxt} from "./arenaFactory.js";
import {parseTxtToMap} from "./arenaFactory.js";
import {TileMap} from "./arenaFactory.js";
import {PlayerOne} from "./playerOne.js";
import {PlayerTwo} from "./playerTwo.js";
import {getCharacter} from "./characterData.js";
import {SoundFX} from "./soundFX.js";

const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
const CANVAS = document.querySelector('#gameWorld');

//-------------------------------------------Place in modules for final-------------------------------------------//
/**
 * Put this inside an arena selector class]
 */
export const arenas = {
    arena1: {
        tileSet: "./assets/tileset/Industrial Tileset/1_Industrial_Tileset_1B.png",
        background: "./assets/background/background02.jpeg",
        backgroundSound: "backgroundMusic1",
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
        p1: [35, 354, 353], //left platform [left most, right most, y value]
        p2: [356, 703, 515],//center platform [left most, right most, y value]
        p3: [705, 990, 353], // right platform [left most, right most, y value]
        p4: [0, 1023, 737], // does not exist
        p5: [0, 1023, 737], // bottom-right platform [left most, right most, y value
        floor: 737, // The y-value of the floor.
        playerOnePos: [120, 590],
        playerTwoPos: [736, 590],
    },
    // Add more arenas assets here
    arena2: {
        tileSet: "./assets/tileset/Industrial Tileset/1_Industrial_Tileset_1C.png",
        background: "./assets/background/background01.jpeg",
        backgroundSound: "backgroundMusic2",
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
        p1: [33, 320, 162], //top-left platform [left most, right most, y value]
        p2: [675, 960, 162],
        p3: [320, 607, 353],
        p4: [0, 288, 513],
        p5: [705, 990, 513], // bottom-right platform [left most, right most, y value
        floor: 737, // The y-value of the floor.
        playerOnePos: [120, 13],
        playerTwoPos: [760, 13],
    }
}
//-------------------------------------------End of module---------------------------------------------------//

export const global = {
    CANVAS_W: CANVAS.width,
    CANVAS_H: CANVAS.height,
    arenas: arenas,
}


// Preload all character assets
Object.values(getAllCharacterData()).forEach(character => {
    ASSET_MANAGER.queueDownload(character.img);
});

// Wait for menu selections and then start the game
window.addEventListener('gameStart', async (event) => {
    const { character1, character2, arena: arenaName } = event.detail;
    const arena = arenas[arenaName];

    // Update HUD with selected characters
    if (window.hudSystem) {
        window.hudSystem.updateCharacterName(1, character1);
        window.hudSystem.updateCharacterName(2, character2);
        window.hudSystem.resetHealth();
        window.hudSystem.updateRound(1);
        window.hudSystem.updateTimer(99);
    }

    ASSET_MANAGER.downloadAll(async () => {
        const canvas = document.getElementById("gameWorld");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        canvas.tabIndex = 1;
        canvas.focus();

        const playerOne = new PlayerOne(gameEngine, ASSET_MANAGER, character1, arena.playerOnePos[0], arena.playerOnePos[1]);
        const playerTwo = new PlayerTwo(gameEngine, ASSET_MANAGER, character2, arena.playerTwoPos[0], arena.playerTwoPos[1]);

        const arena1TileMap = await setArenaAssets(arena);

        gameEngine.init(ctx);

        //Add new Arenas/sprite entities.
        gameEngine.addEntity(arena1TileMap);

        //Add new Player Entity
        gameEngine.addEntity(playerOne);
        gameEngine.addEntity(playerTwo)

        // Start the gameEngine
        gameEngine.start();
        new SoundFX().play(arena.backgroundSound);

        // Start game timer
        if (window.hudSystem) {
            window.hudSystem.startTimer(99);
        }
    });
});

/**
 * Sets a new promise to resolve the tileSetImg path
 *
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
 *
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