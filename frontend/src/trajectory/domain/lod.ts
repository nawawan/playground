import type { BoundingBox, LodOverrides, TrajectoryActivity } from "./types";

// Activities start with the thinnest track (LOD 1) and switch to LOD 3 once the
// map is zoomed in to at least this (maplibre) zoom level.
export const LOD3_MIN_ZOOM = 4;
export const DETAILED_LOD = 3;

export const isDetailedZoom = (zoom: number) => zoom >= LOD3_MIN_ZOOM;

export const bboxToQuery = (bounds: BoundingBox) => bounds.join(",");

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
