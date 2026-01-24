import {GameEngine} from "./gameengine.js";
import {AssetManager} from "./assetmanager.js";
import {AwesomeCharacter} from "./character/awesome_character.js";
import {Camera, Drawable, Pane, Render, World} from "./render/Render.js";
import {Matrix, MatrixOp} from "../Matrix/Matrix.js";
import {Spritesheet} from "./character/animation.js";
import {Entity} from "./entity.js";
import {Character} from "./character/character.js";

export const global = {};

const gameEngine = new GameEngine();
gameEngine.options = {
	debugging: false,
};

const imgName = "img/Guy.png";

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload(imgName);
ASSET_MANAGER.queueDownload("img/background.png");
ASSET_MANAGER.queueDownload("sfx/swing.wav");
ASSET_MANAGER.queueDownload("sfx/walk01.wav");
ASSET_MANAGER.queueDownload("sfx/walk02.wav");
ASSET_MANAGER.queueDownload("sfx/walk03.wav");
ASSET_MANAGER.queueDownload("sfx/walk04.wav");
ASSET_MANAGER.queueDownload("sfx/walk05.wav");
ASSET_MANAGER.queueDownload("sfx/walk06.wav");
ASSET_MANAGER.queueDownload("sfx/walk07.wav");


let char;

// to make certain parameters visible to the window debug console
window.DEBUG = {
	engine : gameEngine,
	assets : ASSET_MANAGER,
}

global.assets = ASSET_MANAGER;

let background = {
	draw : (context) => {
		context.drawImage(ASSET_MANAGER.getAsset("img/background.png"), 0, 0);
	},
	update : () => {},
}

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	ASSET_MANAGER.getAudio("sfx/swing.wav").volume = 0.25

	// camera render testing
	const world = new World();
	const pane = new Pane()
	const camera = new Camera(canvas.width, canvas.height);
	const renderer = new Render(camera, world);

	world.addPane(pane);
	// move camera to view stuff
	let transform = MatrixOp.identity(4);
	transform.set(2, 3, 3);
	camera.transform(transform);

	window.DEBUG.render = {
		world : world,
		renderer : renderer,
		pane : pane,
		// entity : entity,
		renderLoop : true,
		date : new Date(),
		loop : async function() {
			while (window.DEBUG.render.renderLoop) {
				let time = Date.now();
				window.DEBUG.render.renderer.render(ctx);
				await new Promise(requestAnimationFrame);
				console.log("Frame time: " + (Date.now() - time) + " ms");
			}
			},
	}

	gameEngine.init(ctx);

	let img = ASSET_MANAGER.getAsset(imgName);
	let spritesheet = new Spritesheet(img, 3, 14)
	let c  = new AwesomeCharacter(gameEngine, spritesheet);

	pane.addDrawable(c);

	window.DEBUG.char = c;

	gameEngine.addEntity(c);
	gameEngine.addEntity(background);
	gameEngine.render = renderer;

	gameEngine.start();
});
