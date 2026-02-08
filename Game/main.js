import {Matrix, MatrixOp} from "../Matrix/Matrix.js";
import {GameEngine} from "./engine/gameengine.js"
import {AssetManager} from "./assets/assetmanager.js";

import {SoundFX} from "./engine/soundFX.js";
import {StaticEntity} from "./character/entity.js";
import {Spritesheet} from "./character/animation.js";
import {Camera, Pane, Render, World} from "./engine/render/Render.js";
import {CharacterFactory as CharacterFactory} from "./character/characterFactory.js";
import {KeyMapper} from "./engine/keymapper.js";
import {ArenaFactory} from "./arena/arenaFactory.js";

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
AssetManager.queueDownload("tileset/Industrial_Tileset/1_Industrial_Tileset_1.png")
AssetManager.queueDownload("tileset/Industrial_Tileset/1_Industrial_Tileset_1B.png")
AssetManager.queueDownload(arena.background);

AssetManager.queueDownload("arena/basic.txt")
AssetManager.queueDownload("arena/arena2.txt")


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

    const backgroundAsset = AssetManager.getAsset(arena.background);


    const backgroundDrawable = new StaticEntity(new Spritesheet(backgroundAsset, 1, 1));
    backgroundDrawable.drawingProperties.bounds.setDimensionAspect(20, 2250/2975)

    backgroundDrawable.drawingProperties.bounds.setStart(
        -backgroundDrawable.drawingProperties.bounds.dimension.width / 2,
        backgroundDrawable.drawingProperties.bounds.dimension.height /2,
    );

    // let tile = TileFactory.makeTile(
    //     TileFactory.setName.INDUSTRIAL, // pass in the tile set name
    //     IndustrialTileFactory.tileNames.PLAT_LEFT // pass in the tile name for the set
    // );
    // tile.setPosition(-1, 0, 0)
    // tilePane.addDrawable(tile)
    //
    // let tile2 = TileFactory.makeTile(
    //     TileFactory.setName.INDUSTRIAL, // pass in the tile set name
    //     IndustrialTileFactory.tileNames.COL_TOP // pass in the tile name for the set
    // );
    // tile2.setPosition(1, 0, 0)
    // tilePane.addDrawable(tile2)

    for (let item of ArenaFactory.makeArena(ArenaFactory.arenas.ARENA2)) {
        tilePane.addDrawable(item);
    }


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


    const camera = new Camera(canvas.width, canvas.height);
    camera.setDepth(5);
    const renderer = new Render(camera, world);

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
    forePane.addDrawable(playerOne, playerTwo);

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

