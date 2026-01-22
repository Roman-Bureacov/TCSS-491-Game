import { Matrix } from "../Matrix/Matrix.js";
import { GameEngine } from "./gameengine.js"
import { AssetManager } from "./assetmanager.js";

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	gameEngine.start();
});
