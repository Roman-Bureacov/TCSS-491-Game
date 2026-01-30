import {Matrix, MatrixOp} from "../Matrix/Matrix.js";
import {GameEngine} from "./engine/gameengine.js"
import {AssetManager} from "./assets/assetmanager.js";
// import {ArenaFactory, TileMapDrawable} from "./arenaFactory.js";
// import {loadArenaTxt} from "./arenaFactory.js";
// import {parseTxtToMap} from "./arenaFactory.js";
// import {TileMap} from "./arenaFactory.js";
// import {PlayerOne} from "./playerOne.js";
// import {PlayerTwo} from "./playerTwo.js";
import {getCharacterData} from "./character/characterData.js";
import {SoundFX} from "./engine/soundFX.js";
import {StaticEntity} from "./character/entity.js";
import {Spritesheet} from "./character/animation.js";
import {Camera, Pane, Render, World} from "./engine/render/Render.js";
import {CharacterFactory as CharacterFactory} from "./character/characterFactory.js";
import {KeyMapper} from "./engine/keymapper.js";

const gameEngine = new GameEngine(undefined, undefined);
const CANVAS = document.querySelector('#gameWorld');
window.DEBUG = {
    engine: gameEngine,
    assets: AssetManager,
}

//-------------------------------------------Place in modules for final-------------------------------------------//
/**
 * Put this inside an arena selector class]
 */
export const arenas = {
    arena1: {
        tileSet: "./assets/tileset/Industrial Tileset/1_Industrial_Tileset_1c.png",
        background: "background/background03.jpeg",
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
        tileSet: "./assets/tileset/Industrial Tileset/1_Industrial_Tileset_1b.png",
        background: "background/background01.jpeg",
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


// The output of the character name for each player.
const character1 = CharacterFactory.names.guy; //CHARACTER_SELECTOR.getPlayerCharacter()[0] //player 1 character
// const character2 = "guy2"; //CHARACTER_SELECTOR.getPlayerCharacter()[1] //player 2 character

// The output of the arena object for the game.
const arena = arenas.arena1; //ARENA_SELECTOR.getArena()

// const character1Img = getCharacterData(character1).img;
// const character2Img = getCharacterData(character2).img;

// queue the image path for download.
// AssetManager.queueDownload(character1Img);
AssetManager.queueDownload("character/guy1/Guy.png");
// AssetManager.queueDownload(character2Img);
AssetManager.queueDownload(arena.background);


AssetManager.downloadAll(async () => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    canvas.tabIndex = 1;
    canvas.focus();

    const world = new World();
    const backgroundPane = new Pane();
    const tilePane = new Pane();
    const forePane = new Pane();

    const playerOne = CharacterFactory.makePlayer(character1, gameEngine);
    const playerTwo = CharacterFactory.makePlayer(character1, gameEngine);
    // const playerOne = new PlayerOne(gameEngine, ASSET_MANAGER, character1, arena.playerOnePos[0], arena.playerOnePos[1]);
    // const playerTwo = new PlayerTwo(gameEngine, ASSET_MANAGER, character2, arena.playerTwoPos[0], arena.playerTwoPos[1]);
    const backgroundAsset = AssetManager.getAsset(arena.background);
    // const arenaTileMap = await setArenaAssets(arena, tilePane);


    // const tileDrawable = new TileMapDrawable(arenaTileMap, global.CANVAS_W, global.CANVAS_H);
    const backgroundDrawable = new StaticEntity(new Spritesheet(backgroundAsset, 1, 1));
    backgroundDrawable.setDimensionAspect(20, 2250/2975)
    // tileDrawable.position.x = -1105;
    // tileDrawable.position.y = 1000;
    // tileDrawable.setDimension(2210, 2465)
    // tileDrawable.updateStatic();
    


    backgroundDrawable.setPosition(
        -backgroundDrawable.dimX() / 2,
        backgroundDrawable.dimY() /2,
        0
    );

    // playerOne.setPosition(0, 0);

    playerOne.keymapper.inputMap = {
            [KeyMapper.getName("KeyD", true)]: "move right",
            [KeyMapper.getName("KeyA", true)]: "move left",
            [KeyMapper.getName("KeyS", true)]: "attack",
            [KeyMapper.getName("KeyD", false)]: "stop right",
            [KeyMapper.getName("KeyA", false)]: "stop left",
        };

    playerTwo.keymapper.inputMap = {
        [KeyMapper.getName("KeyL", true)]: "move right",
        [KeyMapper.getName("KeyJ", true)]: "move left",
        [KeyMapper.getName("KeyK", true)]: "attack",
        [KeyMapper.getName("KeyL", false)]: "stop right",
        [KeyMapper.getName("KeyJ", false)]: "stop left",
    };

    // playerTwo.physics.position.x = 500;
    // playerTwo.physics.position.y = 0;

    const camera = new Camera(canvas.width, canvas.height);
    camera.setDepth(5);
    const renderer = new Render(camera, world);

    // let transform = MatrixOp.identity(4);
    // transform.set(2, 3, 3);
    // camera.transform(transform);

    window.DEBUG.render = {
        world: world,
        renderer: renderer,
        pane: forePane,
        // entity : entity,
        renderLoop: true,
        date: new Date(),
        loop: async function () {
            while (window.DEBUG.render.renderLoop) {
                let time = Date.now();
                window.DEBUG.render.renderer.render(ctx);
                await new Promise(requestAnimationFrame);
                console.log("Frame time: " + (Date.now() - time) + " ms");
            }
        },
        context: ctx,
    }


    gameEngine.init(ctx);

    backgroundPane.addDrawable(backgroundDrawable);
    // tilePane.addDrawable(tileDrawable);
    forePane.addDrawable(playerOne, playerTwo);
    // forePane.addDrawable(playerTwo);

    window.DEBUG.char = playerOne;

    //Add new Arenas/sprite entities.
    // gameEngine.addEntity(arena1TileMap);

    //Add new Player Entity
    gameEngine.addEntity(playerOne);
    gameEngine.addEntity(playerTwo)

    gameEngine.render = renderer;
    world.addPane(backgroundPane);
    world.addPane(tilePane);
    world.addPane(forePane);

    // Start the gameEngine
    gameEngine.start();
    new SoundFX().play(arena.backgroundSound);
});

//
//
// /**
//  * Sets a new promise to resolve the tileSetImg path
//  *
//  * @param theTileSetPath The path to the tile sheet
//  * @param theTileSetImg a new TileSetImage
//  * @returns {Promise<String>} the path of the tile sheet.
//  */
// function setTileSetPromise(theTileSetPath, theTileSetImg) {
//     return new Promise((resolve, reject) => {
//         theTileSetImg.onload = () => resolve(theTileSetImg);
//         theTileSetImg.onerror = () => reject(new Error("Tileset failed to load: " + theTileSetPath));
//         theTileSetImg.src = theTileSetPath;
//     });
// }
//
// /**
//  * Sets the promise and map text
//  * Used to keep the assetManager clutter-free
//  *
//  * @param tileset The tileset path
//  * @param map The mapText file path
//  * @returns {(Promise<String>|Promise<*>)[]} A List with the promise and map text path.
//  */
// function setPromiseAndLoadArenaText(tileset, map) {
//     return [setTileSetPromise(tileset, new Image()), loadArenaTxt(map)]
// }
//
// /**
//  * Sets the tileMap Object
//  *
//  * @param theTileSheet The arenas tileSheet
//  * @param theArenasBackground The path to the arenas background.
//  * @param theArenaName the Arenas String name
//  * @param theMapText the Map Text Path
//  * @param theTileWidth
//  * @param theTileHeight
//  * @param theArenaLegend the arenas Legend Object
//  * @param backgroundPane
//  * @returns {TileMap} a new TileMap Object.
//  */
// function setTileMap(theTileSheet, theMapText, theArenasBackground, theArenaName, theTileWidth, theTileHeight, theArenaLegend, backgroundPane) {
//     const col = global.CANVAS_W / theTileWidth;
//     const row = global.CANVAS_H / theTileHeight;
//     const factory = new ArenaFactory(theTileSheet, theArenasBackground, theArenaName, theTileWidth, theTileHeight, AssetManager, gameEngine, global.CANVAS_W, global.CANVAS_H, backgroundPane);
//     const buildMap = parseTxtToMap(theMapText, col, row, theArenaLegend);
//     return new TileMap(factory, buildMap);
// }
//
// /**
//  * Builds the arena
//  *
//  * @param arenaObj The arena object
//  * @param backgroundPane
//  * @returns {Promise<TileMap>} a returned promise of the tiled map of the arena.
//  */
// async function setArenaAssets(arenaObj, backgroundPane) {
//     let arenaTilesetSheet, arenaMapTxt;
//     [arenaTilesetSheet, arenaMapTxt] = await Promise.all(setPromiseAndLoadArenaText(arenaObj.tileSet, arenaObj.map));
//
//     return setTileMap(arenaTilesetSheet, arenaMapTxt, arenaObj.background, arenaObj.name, arenaObj.tileWidth, arenaObj.tileHeight, arenaObj.legend, backgroundPane)
// }