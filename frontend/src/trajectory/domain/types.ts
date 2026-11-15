export type ActivityType = "bike" | "run";

export type LngLat = [number, number];

export type PhotoPositionSource = "time" | "exif" | "manual";

export type TrajectoryPhoto = {
  id: string;
  activityId: string;
  url: string;
  thumbnailUrl: string;
  // Meters from the start of the activity; null while the photo is not placed.
  distanceM: number | null;
  lng: number | null;
  lat: number | null;
  source: PhotoPositionSource | null;
  takenAt: string | null;
  // Position along the elevation chart (0..1) of the track currently shown.
  // Derived from distanceM, so it follows LOD switches; null while not placed.
  at: number | null;
};

export type PhotoUploadStatus = {
  uploading: boolean;
  // files that could not be stored, with the reason
  failures: { fileName: string; reason: string }[];
};

// A trip made of several activities. Its distance, elevation gain and track are
// derived from the activities; only the name is stored.
export type Travel = {
  id: string;
  name: string;
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
  // Drawn as separate lines on the map (a travel has one per day). `track` is
  // their concatenation and is what the elevation chart is indexed by.
  segments?: LngLat[][];
  elevation: number[];
  // null for a standalone activity.
  travelId: string | null;
  photos: TrajectoryPhoto[];
};

export type MapStyleKey = "terrain" | "streets";


// Sidebar selection that shows every activity on a single map.
export const ALL_ACTIVITY_ID = "all";

// Sidebar selection of a travel (all of its activities at once). Activity ids
// are numeric strings, so the prefix cannot collide with them.
export const TRAVEL_ID_PREFIX = "travel:";

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
