import { durationMinutes } from "./travel";
import type { TrajectoryPhoto } from "./types";

const parse = (value: string): Date | null => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const two = (n: number) => String(n).padStart(2, "0");

// "2026.08.30"; the raw text when it is not a date.
export const formatDate = (value: string): string => {
  const date = parse(value);
  return date ? `${date.getFullYear()}.${two(date.getMonth() + 1)}.${two(date.getDate())}` : value;
};

// "08.30"
export const formatShortDate = (value: string): string => {
  const date = parse(value);
  return date ? `${two(date.getMonth() + 1)}.${two(date.getDate())}` : value;
};

// "05.10–05.11", or a single date when the travel is within one day.
export const formatPeriod = (start: string, end: string): string => {
  const from = formatShortDate(start);
  const to = formatShortDate(end);
  return from === to ? from : `${from}–${to}`;
};

// meters -> "86 km"
export const formatKm = (meters: number): string => `${Math.trunc(meters / 1000)} km`;

export const formatGain = (meters: number): string => `+${Math.trunc(meters)}m`;

// "307" (minutes) -> "307 min"; other text ("6h 12m") is shown as it is.
export const formatDuration = (duration: string): string =>
  /^\d+$/.test(duration) && durationMinutes(duration) >= 0 ? `${duration} min` : duration;

// "25.8 km 地点"; null while the photo is not placed.
export const photoPlace = (photo: TrajectoryPhoto): string | null =>
  photo.distanceM === null ? null : `${(photo.distanceM / 1000).toFixed(1)} km 地点`;

export const photoLabel = (photo: TrajectoryPhoto): string => `写真（${photoPlace(photo) ?? "位置情報なし"}）`;
