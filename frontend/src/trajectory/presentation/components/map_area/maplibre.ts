import { LngLatBounds, setWorkerUrl } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { StyleSpecification } from "@maplibre/maplibre-gl-style-spec";
import type { LngLat, MapStyleKey } from "../../../domain/types";

// maplibre-gl v6 loads its worker as a separate ESM file that imports a shared
// chunk. Vite serves neither from the bundle (404), so GeoJSON sources never
// load. Let Vite bundle the worker with its deps and point maplibre to it.
setWorkerUrl(maplibreWorkerUrl);

// Free-for-prototyping tile sources. OpenTopoMap/OpenStreetMap raster tiles
// have usage policies that make them unsuitable for real production traffic
// — swap for MapTiler/Stadia/self-hosted tiles before this app sees real load.
const rasterStyle = (tileUrl: string, attribution: string): StyleSpecification => ({
  version: 8,
  sources: {
    base: {
      type: "raster",
      tiles: [tileUrl],
      tileSize: 256,
      attribution,
    },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": "#f4f4f5" } },
    { id: "base", type: "raster", source: "base" },
  ],
});

export const MAP_STYLE_SOURCES: Record<MapStyleKey, () => StyleSpecification | string> = {
  terrain: () =>
    rasterStyle("https://a.tile.opentopomap.org/{z}/{x}/{y}.png", "© OpenTopoMap (CC-BY-SA), © OpenStreetMap"),
  streets: () => rasterStyle("https://tile.openstreetmap.org/{z}/{x}/{y}.png", "© OpenStreetMap contributors"),
};

export const boundsOf = (track: LngLat[]) =>
  track.reduce((bounds, point) => bounds.extend(point), new LngLatBounds(track[0], track[0]));
