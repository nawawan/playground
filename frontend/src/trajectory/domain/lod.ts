import type { BoundingBox, LodOverrides, TrajectoryActivity } from "./types";

// Activities start with the thinnest track (LOD 1) and switch to LOD 3 once the
// map is zoomed in to at least this (maplibre) zoom level.
// LOD 1 simplifies with epsilon 500m, which is ~4px off at zoom 10 (~125m/px at
// mid latitudes) and starts to look coarse; LOD 3 (20m) stays smooth to ~zoom 14.
export const LOD3_MIN_ZOOM = 10;
export const DETAILED_LOD = 3;

export const isDetailedZoom = (zoom: number) => zoom >= LOD3_MIN_ZOOM;

// True when `inner` lies entirely within `outer`.
export const containsBounds = (outer: BoundingBox, inner: BoundingBox) =>
  outer[0] <= inner[0] && outer[1] <= inner[1] && outer[2] >= inner[2] && outer[3] >= inner[3];

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
