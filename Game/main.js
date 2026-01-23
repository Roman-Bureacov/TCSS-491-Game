import {GameEngine} from "./gameengine.js";
import {AssetManager} from "./assetmanager.js";
import {AwesomeCharacter} from "./character/awesome_character.js";

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
	char : char,
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


	gameEngine.init(ctx);

	let img = ASSET_MANAGER.getAsset(imgName);
	let c = char = new AwesomeCharacter(gameEngine, img);
	c.position.x = 500 - c.spritesheet.width/2;
	c.position.y = 190;
	gameEngine.addEntity(c);
	gameEngine.addEntity(background);

	gameEngine.start();
});
