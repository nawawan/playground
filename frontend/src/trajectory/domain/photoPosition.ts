import type { LngLat, TrajectoryActivity, TrajectoryPhoto } from "./types";
import { clamp } from "./geo";

const EARTH_RADIUS_M = 6378137;

const haversine = (a: LngLat, b: LngLat): number => {
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

// Meters from the start for every vertex of the track, scaled so that the last
// one equals `totalM` (the activity's distance). The backend scales the same way,
// so a stored distance_m means the same place on a track of any LOD.
export const cumulativeDistances = (track: LngLat[], totalM: number): number[] => {
  const cumulative = [0];
  for (let i = 1; i < track.length; i += 1) {
    cumulative.push(cumulative[i - 1] + haversine(track[i - 1], track[i]));
  }
  const length = cumulative[cumulative.length - 1] ?? 0;
  const scale = length > 0 && totalM > 0 ? totalM / length : 1;
  return cumulative.map((d) => d * scale);
};

// Index of the first element greater than `value` (the array is ascending).
const upperBound = (values: number[], value: number): number => {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (values[mid] <= value) low = mid + 1;
    else high = mid;
  }
  return low;
};

// distance_m -> position along the elevation chart (0..1). The chart is indexed
// by track vertex, not by distance, so this walks the vertices.
export const atFromDistance = (track: LngLat[], totalM: number, distanceM: number): number => {
  if (track.length < 2) return 0;
  const cumulative = cumulativeDistances(track, totalM);
  const d = clamp(distanceM, 0, cumulative[cumulative.length - 1]);
  const after = upperBound(cumulative, d);
  if (after >= cumulative.length) return 1;
  const i = Math.max(after - 1, 0);
  const span = cumulative[i + 1] - cumulative[i];
  const ratio = span > 0 ? (d - cumulative[i]) / span : 0;
  return (i + ratio) / (track.length - 1);
};

// Position along the elevation chart (0..1) -> distance_m. Inverse of atFromDistance.
export const distanceFromAt = (track: LngLat[], totalM: number, at: number): number => {
  if (track.length < 2) return 0;
  const cumulative = cumulativeDistances(track, totalM);
  const scaled = clamp(at) * (track.length - 1);
  const i = Math.min(Math.floor(scaled), track.length - 2);
  return cumulative[i] + (cumulative[i + 1] - cumulative[i]) * (scaled - i);
};

// Attaches the photos of the activity, with `at` resolved on the shown track.
export const withPhotos = (activity: TrajectoryActivity, photos: TrajectoryPhoto[]): TrajectoryActivity => ({
  ...activity,
  photos: photos
    .filter((photo) => photo.activityId === activity.id)
    .map((photo) => ({
      ...photo,
      at: photo.distanceM === null ? null : atFromDistance(activity.track, activity.km, photo.distanceM),
    })),
});
