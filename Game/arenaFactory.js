'use strict';

class ArenaFactory {

    /**
     * Constructs the arena builder object
     * @param theTileSheet The tile asset sheet path
     */
    constructor(theTileSheet) {
        Object.assign(this, {theTileSheet});

        this.tileSetCols = Math.floor(theTileSheet.width / TILE_SIZE);
    }

    srcRect(theTileID) {
        const cols = Math.floor(this.theTileSheet.width / TILE_SIZE);
        if (!cols) throw new Error ("Tileset image not loaded yet (width=0).");
        
        const sx = (theTileID % cols) * TILE_SIZE;
        const sy = Math.floor(theTileID/ cols) * TILE_SIZE;

        return {sx, sy, sw: TILE_SIZE, sh: TILE_SIZE};
    }


    draw(ctx, map, cols, rows) {
        for (let y = 0; y < rows; y++) {
            for(let x = 0; x < cols; x++) {
                const tileId = map[y * cols + x];
                if (tileId < 0) continue;
                const {sx, sy, sw, sh} = this.srcRect(tileId);
                ctx.drawImage(
                    this.theTileSheet, 
                    sx, sy, sw, sh, 
                    x * TILE_SIZE, y * TILE_SIZE,
                    TILE_SIZE, TILE_SIZE);
            }
        }
    }

}

function parseTxtToMap(txt, cols, rows, legend) {
  const lines = txt.replace(/\r/g, "").split("\n"); // KEEP blank lines

  const map = new Array(cols * rows).fill(-1);

  for (let y = 0; y < rows; y++) {
    const line = (lines[y] ?? "").padEnd(cols, " ").slice(0, cols);

    for (let x = 0; x < cols; x++) {
      const ch = line[x];
      map[y * cols + x] = (ch in legend) ? legend[ch] : -1;
    }
  }
  return map;
}

async function loadArenaTxt(path) {
    const res = await fetch(path);
    if(!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.text();
}

/**
 * Gets the tiles based on the current column and row
 */
class TileMap {
  constructor(factory, map, cols, rows) {
    this.factory = factory;
    this.map = map;
    this.cols = cols;
    this.rows = rows;
    this.removeFromWorld = false;
  }

  update() {
    // no-op (static background)
  }

  draw(ctx) {
    this.factory.draw(ctx, this.map, this.cols, this.rows);
  }
}