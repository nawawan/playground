import type { BoundingBox } from "./types";

// Slippy-map tile (XYZ scheme, Web Mercator): x counts from the west, y from
// the north. https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
// The backend derives the tile's extent from z/x/y itself (PostGIS
// ST_TileEnvelope), so only this numbering has to agree.
export type Tile = { z: number; x: number; y: number };

// Web Mercator is undefined beyond this latitude.
const MAX_LATITUDE = 85.0511287798;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const tileKey = ({ z, x, y }: Tile) => `${z}/${x}/${y}`;

export const lngLatToTile = (lng: number, lat: number, z: number): Pick<Tile, "x" | "y"> => {
  const tilesPerSide = 2 ** z;
  const latRad = (clamp(lat, -MAX_LATITUDE, MAX_LATITUDE) * Math.PI) / 180;
  const x = Math.floor(((clamp(lng, -180, 180) + 180) / 360) * tilesPerSide);
  const y = Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * tilesPerSide);
  return { x: clamp(x, 0, tilesPerSide - 1), y: clamp(y, 0, tilesPerSide - 1) };
};

// Every tile at zoom `z` that intersects the viewport (west, south, east, north).
export const tilesCovering = ([west, south, east, north]: BoundingBox, z: number): Tile[] => {
  const northWest = lngLatToTile(west, north, z);
  const southEast = lngLatToTile(east, south, z);

  const tiles: Tile[] = [];
  for (let x = northWest.x; x <= southEast.x; x++) {
    for (let y = northWest.y; y <= southEast.y; y++) {
      tiles.push({ z, x, y });
    }
  }
  return tiles;
};
