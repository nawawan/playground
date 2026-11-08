export type ActivityType = "bike" | "run";

export type LngLat = [number, number];

export type TrajectoryPhoto = {
  id: string;
  at: number;
  caption: string;
  stamp: string;
  color: string;
};

export type TrajectoryActivity = {
  id: string;
  title: string;
  subtitle: string;
  type: ActivityType;
  date: string;
  km: number;
  gain: number;
  duration: string;
  note: string;
  color: string;
  center: LngLat;
  zoom: number;
  track: LngLat[];
  elevation: number[];
  photos: TrajectoryPhoto[];
};

export type MapStyleKey = "terrain" | "streets";


// Sidebar selection that shows every activity on a single map.
export const ALL_ACTIVITY_ID = "all";

// west, south, east, north
export type BoundingBox = [number, number, number, number];

export type MapViewport = {
  zoom: number;
  bounds: BoundingBox;
};

// Higher-detail (LOD 3) replacement for an activity's base track. `elevation`
// is only known when it was fetched through the single-activity endpoint.
export type LodOverride = {
  track: LngLat[];
  elevation?: number[];
};

export type LodOverrides = Record<string, LodOverride>;
