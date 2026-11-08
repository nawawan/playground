import type { LodOverrides, TrajectoryActivity } from "./types";

// Activities start with the thinnest track (LOD 1) and switch to LOD 3 once the
// map is zoomed in to at least this (maplibre) zoom level.
// LOD 1 simplifies with epsilon 500m, which is ~4px off at zoom 10 (~125m/px at
// mid latitudes) and starts to look coarse; LOD 3 (20m) stays smooth to ~zoom 14.
export const LOD3_MIN_ZOOM = 10;
export const DETAILED_LOD = 3;

// All-view LOD tracks are fetched per tile of this fixed zoom. It does not follow
// the map zoom, so zooming in stays inside already fetched tiles; two levels below
// the switch zoom keeps a viewport at roughly 1-4 tiles.
export const LOD_TILE_ZOOM = LOD3_MIN_ZOOM - 2;

export const isDetailedZoom = (zoom: number) => zoom >= LOD3_MIN_ZOOM;

// Applies LOD overrides to an activity. The track and elevation are swapped
// together because elevation[i] belongs to track[i].
export const applyLodOverride = (activity: TrajectoryActivity, overrides: LodOverrides): TrajectoryActivity => {
  const override = overrides[activity.id];
  if (!override) return activity;
  return {
    ...activity,
    track: override.track,
    elevation: override.elevation ?? activity.elevation,
  };
};
