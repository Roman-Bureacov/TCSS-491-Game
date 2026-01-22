const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

const TILE_SIZE = 32;

const CANVAS_W = 1024;
const CANVAS_H = 768;

const COLS = CANVAS_W / TILE_SIZE;
const ROWS = CANVAS_H / TILE_SIZE

const LEGEND = {

    "<": 0, // left platform piece
    "#": 1, // center platform piece
    ">": 2, // right platform piece

    "!": 3, // Single platform piece

    "/": 6, // left Floor piece
    "_": 7, // center floor piece
    "\\": 8, // right floor piece
    " ": -1, // Spaces

}

ASSET_MANAGER.downloadAll(async () => {
  const canvas = document.getElementById("gameWorld");
  canvas.tabIndex = 1;
  canvas.focus();

  const ctx = canvas.getContext("2d");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  // Load tileset + background + map text in parallel
  const tileSetImg = new Image();
  const bgImg = new Image();

  const tilesetPromise = new Promise((resolve, reject) => {
    tileSetImg.onload = () => resolve(tileSetImg);
    tileSetImg.onerror = () => reject(new Error("Tileset failed to load"));
    tileSetImg.src =
      "./assets/tileset/[FREE] Industrial Tileset/FREE/5. Industrial Tileset - Starter Pack 32p/1_Industrial_Tileset_1B.png";
  });

  const bgPromise = new Promise((resolve, reject) => {
    bgImg.onload = () => resolve(bgImg);
    bgImg.onerror = () => reject(new Error("Background failed to load"));
    bgImg.src = "./assets/background/Final/Background_0.png";
  });

  const mapPromise = loadArenaTxt("./assets/maps/arena01.txt");

  let tileset, bg, mapTxt;
  try {
    [tileset, bg, mapTxt] = await Promise.all([tilesetPromise, bgPromise, mapPromise]);
  } catch (e) {
    console.error(e);
    return;
  }

  // Build your map + entities
  const factory = new ArenaFactory(tileset);
  const buildMap = parseTxtToMap(mapTxt, COLS, ROWS, LEGEND);

  gameEngine.init(ctx);

  // Add foreground first...
  gameEngine.addEntity(new TileMap(factory, buildMap, COLS, ROWS));

  // ...then background LAST so it draws FIRST (behind everything)
  gameEngine.addEntity(new BackgroundFactory(bg));

  gameEngine.start();
});


