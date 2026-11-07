import type { LngLat } from "./types";

// Ported from backend/usecase/src/service/trajectory/{geo,helper}.rs.
// Keep both in sync: this exists so the thinning level can be previewed in Storybook.

const EARTH_RADIUS = 6378137;

// backend `thin_out_raw_trajectory_by_lod`: lod -> epsilon (web mercator meters)
export const LOD_LEVELS = [1, 2, 3, 4] as const;
export type Lod = (typeof LOD_LEVELS)[number];

export const lodEpsilon = (lod: number): number => {
  switch (lod) {
    case 1:
      return 500;
    case 2:
      return 100;
    case 3:
      return 20;
    default:
      return 1;
  }
};

export const toWebMercator = ([lng, lat]: LngLat): [number, number] => [
  (lng * Math.PI) / 180 * EARTH_RADIUS,
  Math.log(Math.abs(Math.tan((lat * Math.PI) / 180 + Math.PI / 4))) * EARTH_RADIUS,
];

// Returns the kept indices (sorted, always including first and last). Same as `douglas_peucker_simplify`.
export const douglasPeuckerIndices = (track: LngLat[], epsilon: number): number[] => {
  if (track.length < 3) return track.map((_, i) => i);

  const points = track.map(toWebMercator);
  const threshold = epsilon * epsilon;
  const kept = [0, points.length - 1];
  const stack: [number, number][] = [[0, points.length - 1]];

  while (stack.length > 0) {
    const [l, r] = stack.pop() as [number, number];
    if (r - l === 1) continue;

    const [lx, ly] = points[l];
    const [rx, ry] = points[r];
    const base = (rx - lx) ** 2 + (ry - ly) ** 2;
    const currentThreshold = threshold * base;

    let maxArea = 0;
    let index = l;
    for (let i = l + 1; i < r; i++) {
      const [px, py] = points[i];
      const area = ((rx - lx) * (py - ly) - (px - lx) * (ry - ly)) ** 2;
      if (area > currentThreshold && area > maxArea) {
        maxArea = area;
        index = i;
      }
    }

    if (index !== l) {
      stack.push([l, index], [index, r]);
      kept.push(index);
    }
  }

  return kept.sort((a, b) => a - b);
};

export type ThinResult = {
  indices: number[];
  track: LngLat[];
  elevation: number[];
};

export const thinTrajectory = (track: LngLat[], elevation: number[], epsilon: number): ThinResult => {
  const indices = douglasPeuckerIndices(track, epsilon);
  return {
    indices,
    track: indices.map((i) => track[i]),
    elevation: indices.map((i) => elevation[i]),
  };
};

const distanceToSegment = (p: [number, number], a: [number, number], b: [number, number]) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
};

export type DeviationStats = {
  maxMeters: number;
  meanMeters: number;
};

// How far the dropped points are from the thinned polyline (web mercator meters, the unit epsilon is in).
export const deviationStats = (track: LngLat[], indices: number[]): DeviationStats => {
  const points = track.map(toWebMercator);
  let max = 0;
  let sum = 0;
  for (let k = 0; k < indices.length - 1; k++) {
    const a = points[indices[k]];
    const b = points[indices[k + 1]];
    for (let i = indices[k] + 1; i < indices[k + 1]; i++) {
      const d = distanceToSegment(points[i], a, b);
      max = Math.max(max, d);
      sum += d;
    }
  }
  return { maxMeters: max, meanMeters: track.length > 0 ? sum / track.length : 0 };
};

// Turning angle (deg) at each interior vertex; large values are what makes a thinned line look jagged.
export const maxTurnAngle = (track: LngLat[]): number => {
  const points = track.map(toWebMercator);
  let max = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [ax, ay] = [points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]];
    const [bx, by] = [points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1]];
    if ((ax === 0 && ay === 0) || (bx === 0 && by === 0)) continue;
    const angle = Math.abs(Math.atan2(ax * by - ay * bx, ax * bx + ay * by));
    max = Math.max(max, angle);
  }
  return (max * 180) / Math.PI;
};
