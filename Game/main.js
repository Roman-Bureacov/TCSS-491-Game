import {GameEngine} from "./engine/gameengine.js"
import {AssetManager} from "./assets/assetmanager.js";

import {StaticEntity} from "./entity/entity.js";
import {Spritesheet} from "./entity/animation.js";
import {Camera, Pane, Render, World} from "./engine/render/Render.js";
import {CharacterFactory as CharacterFactory} from "./entity/characterFactory.js";
import {ArenaFactory} from "./arena/arenaFactory.js";
import {assignKeymap, PLAYER} from "./entity/keymapAssigner.js";

const gameEngine = new GameEngine(undefined, undefined);
const CANVAS = document.querySelector('#gameWorld');
window.DEBUG = {
    engine: gameEngine,
    assets: AssetManager,
}

export const global = {
    CANVAS_W: CANVAS.width,
    CANVAS_H: CANVAS.height,
}

// queue the image path for download.
AssetManager.queueDownload("character/guy1/Guy.png");
AssetManager.queueDownload("character/guy2/Guy2.png");
AssetManager.queueDownload("character/warriorWoman/warriorWoman.png");
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

    const world = new World();

    const backgroundPane = new Pane();
    const tilePane = new Pane();
    const forePane = new Pane();

    const character1 = CharacterFactory.names.guy; //CHARACTER_SELECTOR.getPlayerCharacter()[0] //player 1 character
    const character2 = CharacterFactory.names.guy2; //CHARACTER_SELECTOR.getPlayerCharacter()[0] //player 1 character

    // create brand-new characters
    const playerOne = CharacterFactory.makePlayer(character1, gameEngine);
    const playerTwo = CharacterFactory.makePlayer(character2, gameEngine);
    // give them keymaps...
    assignKeymap(PLAYER.ONE, playerOne);
    assignKeymap(PLAYER.TWO, playerTwo);

    // make the background
    const backgroundAsset = AssetManager.getAsset("background/background03.jpeg");
    const backgroundDrawable = new StaticEntity(new Spritesheet(backgroundAsset, 1, 1));
    // now position the background...
    backgroundDrawable.drawingProperties.bounds.setDimensionAspect(30, 2250/2975)
    backgroundDrawable.drawingProperties.bounds.setStart(
        -backgroundDrawable.drawingProperties.bounds.dimension.width / 2,
        backgroundDrawable.drawingProperties.bounds.dimension.height /2,
    );



    // now we need a camera
    const camera = new Camera(canvas.width, canvas.height);
    camera.setDepth(5);
    const renderer = new Render(camera, world);

    gameEngine.init(ctx);

    // compile the world
    backgroundPane.addDrawable(backgroundDrawable);
    forePane.addDrawable(playerOne, playerTwo);

    // create the arena
    let arena = ArenaFactory.makeArena(ArenaFactory.arenas.BASIC);
    arena.map(e => tilePane.addDrawable(e))

    world.addPane(backgroundPane);
    world.addPane(tilePane);
    world.addPane(forePane);

    //Add entities
    gameEngine.addDynamicEntity(playerOne, playerTwo);
    arena.map(e => gameEngine.addStaticEntity(e));

    gameEngine.render = renderer;
    gameEngine.focus.playerA = playerOne;
    gameEngine.focus.playerB = playerTwo;

    // debug properties (for console usage)
    window.DEBUG.render = {
        char1 : playerOne,
        char2 : playerTwo,
        world: world,
        renderer: renderer,
        pane: forePane,
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

    // Start the gameEngine
    gameEngine.start();
});

