import { TRAVEL_ID_PREFIX, type TrajectoryActivity, type Travel } from "./types";

export const travelSelectionId = (travelId: string) => `${TRAVEL_ID_PREFIX}${travelId}`;

export const isTravelSelectionId = (id: string) => id.startsWith(TRAVEL_ID_PREFIX);

export const travelIdOfSelection = (id: string) => id.slice(TRAVEL_ID_PREFIX.length);

// `duration` is minutes as a string ("307"); mock data also uses "6h 12m".
export const durationMinutes = (duration: string): number => {
  if (/^\d+$/.test(duration)) return Number(duration);
  const match = /^(?:(\d+)h)?\s*(?:(\d+)m)?$/.exec(duration.trim());
  if (!match || (match[1] === undefined && match[2] === undefined)) return 0;
  return Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0);
};

export const startTimeOf = (activity: TrajectoryActivity): number => {
  const time = Date.parse(activity.date);
  return Number.isNaN(time) ? 0 : time;
};

export type TravelSummary = {
  count: number;
  // meters, like TrajectoryActivity.km
  distance: number;
  gain: number;
  minutes: number;
  startDate: string;
  endDate: string;
};

// Oldest first; a travel reads as a story from its first day.
export const sortByStart = (activities: TrajectoryActivity[]): TrajectoryActivity[] =>
  [...activities].sort((a, b) => startTimeOf(a) - startTimeOf(b));

export const summarizeTravel = (children: TrajectoryActivity[]): TravelSummary => {
  const sorted = sortByStart(children);
  return {
    count: sorted.length,
    distance: sorted.reduce((sum, a) => sum + a.km, 0),
    gain: sorted.reduce((sum, a) => sum + a.gain, 0),
    minutes: sorted.reduce((sum, a) => sum + durationMinutes(a.duration), 0),
    startDate: sorted[0]?.date ?? "",
    endDate: sorted[sorted.length - 1]?.date ?? "",
  };
};

const axisLength = (activity: TrajectoryActivity) =>
  activity.elevation.length > 0 ? activity.elevation.length : activity.track.length;

// Shows a travel as one activity so the detail, elevation chart and photo panel
// work unchanged:
// - the track and the elevation are the days joined in order (`segments` keeps
//   the days apart so the map does not draw a line across the gaps),
// - the photos keep their place, remapped onto the joined chart.
// Children must already carry their photos with `at` resolved.
export const composeTravel = (travel: Travel, children: TrajectoryActivity[]): TrajectoryActivity => {
  const days = sortByStart(children);
  const summary = summarizeTravel(days);
  const total = days.reduce((sum, d) => sum + Math.max(axisLength(d), 1), 0);

  let offset = 0;
  const photos = days.flatMap((day) => {
    const length = Math.max(axisLength(day), 1);
    const start = offset;
    offset += length;
    return day.photos.map((photo) => ({
      ...photo,
      at: photo.at === null || total < 2 ? null : (start + photo.at * (length - 1)) / (total - 1),
    }));
  });

  return {
    id: travelSelectionId(travel.id),
    title: travel.name,
    subtitle: "",
    type: days[0]?.type ?? "bike",
    date: summary.startDate,
    km: summary.distance,
    gain: summary.gain,
    duration: String(summary.minutes),
    note: "",
    color: "var(--accent)",
    center: days[0]?.center ?? [0, 0],
    zoom: days[0]?.zoom ?? 1,
    track: days.flatMap((d) => d.track),
    segments: days.map((d) => d.track),
    elevation: days.flatMap((d) => d.elevation),
    travelId: null,
    photos,
  };
};
