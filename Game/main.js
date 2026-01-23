import { Matrix } from "../Matrix/Matrix.js";
import { GameEngine } from "./gameengine.js"
import { AssetManager } from "./assetmanager.js";
import {AwesomeCharacter} from "./character/awesome_character.js";

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager()

let img = "../img/Guy.png";
ASSET_MANAGER.queueDownload(img);

var char;

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	char = new AwesomeCharacter(gameEngine, ASSET_MANAGER.getAsset(img));
	gameEngine.addEntity(char);

	gameEngine.init(ctx);

	gameEngine.start();
});
