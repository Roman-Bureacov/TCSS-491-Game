/*

The UI will call upon this to initialize the game

 */

/**
 * @typedef GameProperties the properties for starting the game
 * @property {CHARACTER_NAMES} playerOneCharacter the name of the character for the first player
 * @property {CHARACTER_NAMES} playerTwoCharacter the name of the character for the second player
 * @property {ARENAS} arenaName the name of the arena
 * @property {HTMLElement} canvas the canvas to draw on
 */

import {ArenaFactory} from "./arena/arenaFactory.js";
import {PlayerFactory} from "./entity/Players/PlayerFactory.js";
import {GameEngine} from "./engine/gameengine.js";
import {Camera, Pane, Render, World} from "./engine/render/Render.js";
import {SoundFX} from "./engine/soundFX.js";
import {AssetManager} from "./assets/assetmanager.js";
import {getCharacterData} from "./entity/characterData.js";
import {arenaData} from "./arena/arenaData.js";
import {GameState} from "./engine/gamestates.js";
import {EngineDebugger} from "./engine/render/visualdebugger.js";

/**
 * Tells the game to start with the specified parameters.
 *
 * @see {GameState}
 *
 * @author Roman Bureacov
 * @param {GameProperties} props the properties to start the game with
 * @return {Promise} the promise instantiating the `GameState` object
 */
export const launchGame = (props) => {
    return downloadAssets(props) // first, before anything, we need to ensure the assets are available
        .then( () => {
            const context = props.canvas.getContext("2d");

            const world = new World();
            const camera = new Camera(
                props.canvas.width,
                props.canvas.height
            )
            const renderer = new Render(camera, world)
            const game = new GameEngine(undefined, renderer);
            const arena = ArenaFactory.makeArena(props.arenaName);
            const playerOne = PlayerFactory.makePlayer(
                props.playerOneCharacter,
                PlayerFactory.PLAYER_TYPES.ONE,
                game,
                arena.playerAStart.x ?? -1, arena.playerAStart.y ?? 0, // not guaranteed to be defined
                1, 1
            );
            const playerTwo = PlayerFactory.makePlayer(
                props.playerTwoCharacter,
                PlayerFactory.PLAYER_TYPES.TWO,
                game,
                arena.playerBStart.x ?? 1, arena.playerBStart.y ?? 0, // not guaranteed to be defined
                1, 1
            );

            // init renderable world
            const backgroundPane = new Pane() // here lives the background
            const entityPane = new Pane(); // here live the entities
            world.addPane(backgroundPane, entityPane)

            addBackground(backgroundPane, arena.background);
            arena.tiles.forEach(t => entityPane.addDrawable(t));
            entityPane.addDrawable(playerOne, playerTwo);

            // init game with entities
            arena.tiles.forEach(t => game.addStaticEntity(t));
            game.addDynamicEntity(playerOne, playerTwo);

            // start the game
            window.DEBUG = { // debug on window
                game: game,
                renderer: renderer,
                playerOne: playerOne,
                playerTwo: playerTwo,
                visualDebugger: new EngineDebugger(game, entityPane)
            }

            if (arena.music) SoundFX.play(arena.music);
            game.focus.playerA = playerOne;
            game.focus.playerB = playerTwo;
            game.init(context);
            game.start();

            return new GameState(
                game,
                playerOne, playerTwo,
                arena
            );
        });
}

/**
 * Adds the entity (if it exists) to the background pane
 * @param {Pane} background the background pane
 * @param {StaticEntity} entity the entity to add that serves as the background
 */
const addBackground = (background, entity) => {
    if (entity === undefined) return; // not guaranteed to exist

    const bounds = entity.drawingProperties.bounds;
    bounds.setDimensionAspect(75,
        bounds.dimension.width /
        bounds.dimension.height
    )
    bounds.setStart(
        - bounds.dimension.width / 2,
        bounds.dimension.height / 2
    )
    background.addDrawable(entity);
    background.setObjectPosition(
        0, 0, -10
    );
}

/**
 * Downloads the necessary assets to start the game
 * @param {GameProperties} props
 * @return {Promise<void>} the promise of downloading the assets
 */
const downloadAssets = async (props) => {
    // first, get the character assets prepped
    /** @param {string} name name of the character */
    const downloadCharacter = async (name) => {
        const asset = getCharacterData(name).img;
        return AssetManager.downloadOne(asset)
    }

    await downloadCharacter(props.playerOneCharacter);
    await downloadCharacter(props.playerTwoCharacter);

    // now, fetch the arena assets
    const arena = arenaData[props.arenaName];
    if (arena === undefined)
        throw new Error(
            `could not find appropriate arena for "${props.arenaName}"`
        );
    // arena background might not exist
    if (arena.backgroundAssetPath) await AssetManager.downloadOne(arena.backgroundAssetPath);
    await AssetManager.downloadOne(arena.arenaAssetPath);
    await AssetManager.downloadOne(arena.tileSetPath);

    // finally, grab the audio asset
    // ??? the file assets are all pre-loaded in the SoundFX static class

}
