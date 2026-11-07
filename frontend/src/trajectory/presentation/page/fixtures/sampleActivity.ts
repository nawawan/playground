import type { LngLat, TrajectoryActivity } from "../../../domain/types";

type TrackData = { track: LngLat[]; elevation: number[] };

// fixtures/tracks/*.json を置くだけでサンプル activity として並ぶ(点数の違う同一コース等)。
const modules = import.meta.glob<TrackData>("./tracks/*.json", {
  eager: true,
  import: "default",
});

const toRad = (deg: number) => (deg * Math.PI) / 180;

const distanceKm = ([lng1, lat1]: LngLat, [lng2, lat2]: LngLat) => {
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
};

const createSampleActivity = (
  name: string,
  { track, elevation }: TrackData,
): TrajectoryActivity => {
  const km = track
    .slice(1)
    .reduce((sum, point, i) => sum + distanceKm(track[i], point), 0);
  const gain = elevation
    .slice(1)
    .reduce((sum, value, i) => sum + Math.max(0, value - elevation[i]), 0);

  return {
    id: `sample-${name}`,
    title: `サンプル ${track.length}点`,
    subtitle: name,
    type: "bike",
    date: "2026/11/7",
    km: Math.round(km * 10) / 10,
    gain: Math.round(gain),
    duration: "-",
    color: "#2f6f8f",
    note: "実データの track / elevation を使った表示確認用(メタ情報は仮値)。",
    center: [138.77, 35.52],
    zoom: 11,
    track,
    elevation,
    photos: [],
  };
};

// 点数の少ない順
export const sampleActivities: TrajectoryActivity[] = Object.entries(modules)
  .map(([path, data]) =>
    createSampleActivity(path.split("/").pop()!.replace(".json", ""), data),
  )
  .sort((a, b) => a.track.length - b.track.length);
