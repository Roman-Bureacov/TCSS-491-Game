import {GameEngine} from "./engine/gameengine.js"
import {AssetManager} from "./assets/assetmanager.js";

import {Camera, Pane, Render, World} from "./engine/render/Render.js";
import {ArenaFactory} from "./arena/arenaFactory.js";

import {SoundFX} from "./engine/soundFX.js";
import {CHARACTER_NAMES} from "./entity/characterData.js";
import {PlayerFactory} from "./entity/Players/PlayerFactory.js";

const gameEngine = new GameEngine(undefined, undefined);
const CANVAS = document.querySelector('#gameWorld');
window.DEBUG = {
    engine: gameEngine,
    assets: AssetManager,
    soundfx: SoundFX,
}

export const global = {
    CANVAS_W: CANVAS.width,
    CANVAS_H: CANVAS.height,
}

// queue the image path for download.
AssetManager.queueDownload("character/guy1/Guy.png");
AssetManager.queueDownload("character/guy2/Guy2.png");
AssetManager.queueDownload("character/warriorWoman/warriorWoman.png");
AssetManager.queueDownload("character/samurai/samurai1.png")
AssetManager.queueDownload("tileset/Industrial_Tileset/1_Industrial_Tileset_1.png")
AssetManager.queueDownload("tileset/Industrial_Tileset/1_Industrial_Tileset_1B.png")
AssetManager.queueDownload("background/background03.jpeg");

AssetManager.queueDownload("arena/basic.txt")
AssetManager.queueDownload("arena/arena2.txt")


AssetManager.downloadAll(async () => {
    // config
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    canvas.tabIndex = 1;
    canvas.focus();
    
    console.log(AssetManager.getAsset("character/warriorWoman/warriorWoman.png"))

    const world = new World();

    const backgroundPane = new Pane();
    const tilePane = new Pane();
    const forePane = new Pane();

    const character1 = CHARACTER_NAMES.GUY;
    const character2 = CHARACTER_NAMES.SAMURAI_A;
    const playerOne = PlayerFactory.makePlayer(
        character1,
        PlayerFactory.PLAYER_TYPES.ONE,
        gameEngine,
        -1, 0,
        1, 1)
    const playerTwo = PlayerFactory.makePlayer(
        character2,
        PlayerFactory.PLAYER_TYPES.TWO,
        gameEngine,
        1, 0,
        1, 1);

    // now we need a camera
    const camera = new Camera(canvas.width, canvas.height);
    camera.setDepth(5);
    const renderer = new Render(camera, world);

    gameEngine.init(ctx);

    // compile the world
    forePane.addDrawable(playerOne, playerTwo);

    world.addPane(backgroundPane);
    world.addPane(tilePane);
    world.addPane(forePane);

// create the arena (array of TileEntity)

    // build arena

    /*
    TRY THIS:
        change the arena between BASIC and ARENA2

        have a look at the files basic.txt and arena2.txt

        the `detail` specifier is optional (hence all the undefined checks below)
     */
    const arena = ArenaFactory.makeArena(ArenaFactory.arenas.BASIC);

    // TODO: how might we make the music persistent (that is, play only when focused?)
    if (arena.music) SoundFX.play(arena.music);

    console.log(arena);
    // add tiles to the pane
    arena.tiles.forEach(t => tilePane.addDrawable(t));

    // Add entities
    gameEngine.addDynamicEntity(playerOne, playerTwo);
    arena.tiles.forEach(e => gameEngine.addStaticEntity(e));
    // NOTE: the null-coalescing operators here are for demonstration purposes
    // when we get a more proper idea, remove them
    // they're here only to showcase
    playerOne.setPosition(
        arena.playerAStart.x ?? playerOne.objectX(),
        arena.playerAStart.y ?? playerOne.objectY()
    );
    playerTwo.setPosition(
        arena.playerBStart.x ?? playerTwo.objectX(),
        arena.playerBStart.y ?? playerTwo.objectY()
    )

    // make the background...
    addBackground(arena, backgroundPane);

    // set up game engine
    gameEngine.render = renderer;
    gameEngine.focus.playerA = playerOne;
    gameEngine.focus.playerB = playerTwo;

    // debug properties (for console usage)
    window.DEBUG.render = {
        char1: playerOne,
        char2: playerTwo,
        world: world,
        renderer: renderer,
        context: ctx,
    }

    // Start the gameEngine
    gameEngine.start();
});

/**
 * Merely for demonstration purposes
 * @param {ArenaProperties} arena
 * @param {Pane} bg
 */
const addBackground = (arena, bg) => {
    const backgroundDrawable = arena.background;
    if (backgroundDrawable === undefined) return;

    // position background
    backgroundDrawable.drawingProperties.bounds.setDimensionAspect(
        30,
        backgroundDrawable.spritesheet.image.width
        / backgroundDrawable.spritesheet.image.height
    );
    backgroundDrawable.drawingProperties.bounds.setStart( // move drawing
        -backgroundDrawable.drawingProperties.bounds.dimension.width / 2,
        backgroundDrawable.drawingProperties.bounds.dimension.height / 2,
    );
    bg.addDrawable(backgroundDrawable);
}