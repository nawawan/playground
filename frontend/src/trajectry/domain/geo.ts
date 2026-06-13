import type { LngLat } from "./types";

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const elevationAt = (elevation: number[], t: number): number => {
  if (elevation.length === 0) return 0;
  if (t <= 0) return elevation[0];
  if (t >= 1) return elevation[elevation.length - 1];
  const scaled = t * (elevation.length - 1);
  const index = Math.floor(scaled);
  const local = scaled - index;
  return elevation[index] + (elevation[index + 1] - elevation[index]) * local;
};

export const pointAt = (track: LngLat[], t: number): LngLat => {
  if (track.length === 0) return [0, 0];
  if (t <= 0) return track[0];
  if (t >= 1) return track[track.length - 1];
  const scaled = t * (track.length - 1);
  const index = Math.floor(scaled);
  const local = scaled - index;
  const a = track[index];
  const b = track[index + 1];
  return [a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local];
};

export const formatKmAt = (totalKm: number, t: number) => (totalKm * t).toFixed(1);
