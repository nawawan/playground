import { atFromDistance } from "./photoPosition";
import type { LngLat, TrajectoryActivity, TrajectoryPhoto, Travel } from "./types";

// A flat picture in the given color, used as the thumbnail of a mock photo.
const placeholderImage = (color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="${color}"/><circle cx="170" cy="70" r="26" fill="#ffffff" fill-opacity="0.55"/><path d="M0 200 L70 120 L120 170 L170 110 L240 200 V240 H0Z" fill="#000000" fill-opacity="0.25"/></svg>`,
  )}`;

// `at`: position on the elevation chart (0..1); null makes a photo that is not placed yet.
const mockPhoto = (id: string, activity: { id: string; km: number; track: LngLat[] }, at: number | null, color: string): TrajectoryPhoto => ({
  id,
  activityId: activity.id,
  url: placeholderImage(color),
  thumbnailUrl: placeholderImage(color),
  distanceM: at === null ? null : at * activity.km,
  lng: null,
  lat: null,
  source: at === null ? null : "time",
  takenAt: null,
  at: at === null ? null : atFromDistance(activity.track, activity.km, at * activity.km),
});

type BaseActivity = Omit<TrajectoryActivity, "photos" | "travelId">;

const baseActivities: BaseActivity[] = [
  {
    id: "mugikusa",
    title: "麦草峠",
    subtitle: "Mugikusa pass",
    type: "bike",
    date: "2026/4/8",
    km: 120000,
    gain: 2400,
    duration: "6h 12m",
    color: "#d2691e",
    note: "雲が抜けた瞬間 - could finally see the alps. cold tea from the thermos.",
    center: [138.42, 36.05],
    zoom: 10,
    track: [
      [138.27, 36.1],
      [138.3, 36.09],
      [138.34, 36.07],
      [138.38, 36.06],
      [138.42, 36.07],
      [138.45, 36.1],
      [138.48, 36.12],
      [138.5, 36.1],
      [138.52, 36.06],
      [138.54, 36.02],
      [138.56, 35.98],
      [138.58, 35.95],
    ],
    elevation: [
      1200, 1240, 1310, 1450, 1620, 1780, 1920, 2050, 2127, 2050, 1900, 1740,
      1580, 1450, 1340, 1280, 1340, 1450, 1560, 1480, 1380, 1260, 1180, 1100,
      1040, 1080, 1140, 1200, 1280, 1360,
    ],
  },
  {
    id: "tokyo",
    title: "東京ラン",
    subtitle: "Tokyo loop",
    type: "run",
    date: "2026-05-02T08:00:00",
    km: 86916,
    gain: 180,
    duration: "5h 48m",
    color: "#c25b6a",
    note: "皇居 -> 多摩川 -> back. flat & fast, finished before sunset.",
    center: [139.7, 35.66],
    zoom: 11,
    track: [
      [139.75, 35.69],
      [139.74, 35.68],
      [139.72, 35.67],
      [139.7, 35.66],
      [139.68, 35.65],
      [139.66, 35.63],
      [139.64, 35.61],
      [139.62, 35.6],
      [139.6, 35.61],
      [139.62, 35.63],
      [139.65, 35.64],
      [139.68, 35.65],
      [139.71, 35.66],
      [139.74, 35.67],
      [139.76, 35.68],
      [139.75, 35.69],
    ],
    elevation: [
      12, 14, 18, 22, 28, 32, 38, 42, 48, 52, 58, 62, 68, 72, 78, 82, 88, 92,
      98, 102, 108, 112, 118, 122, 128, 130, 125, 118, 110, 100,
    ],
  },
  {
    id: "onsen",
    title: "温泉ライド",
    subtitle: "Onsen ride",
    type: "bike",
    date: "2026/4/2",
    km: 40000,
    gain: 620,
    duration: "2h 48m",
    color: "#5a8c6a",
    note: "small loop. finished in the rotenburo at dusk.",
    center: [139.05, 36.78],
    zoom: 11,
    track: [
      [139, 36.78],
      [139.02, 36.79],
      [139.04, 36.8],
      [139.06, 36.8],
      [139.08, 36.79],
      [139.09, 36.77],
      [139.08, 36.75],
      [139.06, 36.74],
      [139.04, 36.75],
      [139.02, 36.76],
      [139, 36.78],
    ],
    elevation: [420, 460, 510, 580, 640, 720, 780, 820, 760, 680, 600, 540, 490, 460, 440, 420],
  },
  {
    id: "kamakura",
    title: "鎌倉海岸",
    subtitle: "Kamakura coast",
    type: "bike",
    date: "2026/3/28",
    km: 75000,
    gain: 380,
    duration: "3h 48m",
    color: "#5a7a9a",
    note: "—",
    center: [139.55, 35.32],
    zoom: 11,
    track: [
      [139.45, 35.32],
      [139.48, 35.31],
      [139.52, 35.3],
      [139.55, 35.3],
      [139.58, 35.31],
      [139.6, 35.32],
      [139.62, 35.33],
      [139.6, 35.35],
      [139.55, 35.36],
      [139.5, 35.35],
      [139.45, 35.32],
    ],
    elevation: [20, 25, 32, 45, 60, 80, 110, 145, 180, 165, 130, 95, 70, 50, 35, 22],
  },
  {
    id: "takao",
    title: "高尾トレイル",
    subtitle: "Takao trail",
    type: "run",
    date: "2026/3/15",
    km: 18000,
    gain: 580,
    duration: "2h 12m",
    color: "#8a6a4a",
    note: "—",
    center: [139.24, 35.63],
    zoom: 13,
    track: [
      [139.22, 35.63],
      [139.23, 35.64],
      [139.24, 35.64],
      [139.25, 35.63],
      [139.26, 35.62],
      [139.25, 35.61],
      [139.23, 35.62],
      [139.22, 35.63],
    ],
    elevation: [220, 260, 310, 380, 450, 520, 580, 540, 470, 380, 300, 250],
  },
];

// [photo id, position on the chart (null = not placed yet), color]
const PHOTO_SPECS: Record<string, [string, number | null, string][]> = {
  mugikusa: [
    ["p1", 0.08, "#5a8c6a"],
    ["p2", 0.35, "#8a7a5a"],
    ["p3", 0.52, "#a87a4a"],
    ["p4", 0.78, "#6a8a8a"],
  ],
  tokyo: [
    ["p1", 0.15, "#7a8a5a"],
    ["p2", 0.55, "#5a7a8a"],
    ["p3", 0.85, "#a87a5a"],
  ],
  onsen: [
    ["p1", 0.3, "#c25b6a"],
    ["p2", 0.7, "#7a5a8a"],
  ],
  kamakura: [["p1", 0.4, "#5a7a9a"]],
};

export const trajectoryActivities: TrajectoryActivity[] = baseActivities.map((activity) => ({
  ...activity,
  travelId: null,
  photos: (PHOTO_SPECS[activity.id] ?? []).map(([id, at, color]) => mockPhoto(id, activity, at, color)),
}));

// ---- the sidebar of the design: years, a travel and standalone activities ----

// A gentle arc of `n` points, so every mock activity has a track of its own.
const arc = (center: LngLat, span: number, n = 16): LngLat[] =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [center[0] + (t - 0.5) * span, center[1] + Math.sin(t * Math.PI) * span * 0.25] as LngLat;
  });

const ramp = (base: number, rise: number, n = 16) =>
  Array.from({ length: n }, (_, i) => Math.round(base + Math.sin((i / (n - 1)) * Math.PI) * rise));

const listed = (
  id: string,
  title: string,
  date: string,
  km: number,
  gain: number,
  minutes: number,
  center: LngLat,
  color: string,
  photos: [string, number | null, string][] = [],
  travelId: string | null = null,
): TrajectoryActivity => {
  const track = arc(center, 0.3);
  return {
    id,
    title,
    subtitle: "",
    type: "bike",
    date,
    km,
    gain,
    duration: String(minutes),
    color,
    note: "—",
    center,
    zoom: 10,
    track,
    elevation: ramp(400, 450),
    travelId,
    photos: photos.map(([photoId, at, photoColor]) => mockPhoto(photoId, { id, km, track }, at, photoColor)),
  };
};

export const mockTravels: Travel[] = [
  { id: "t-togakushi", name: "戸隠" },
  // a travel without activities is never listed
  { id: "t-empty", name: "まだ空の travel" },
];

export const listedActivities: TrajectoryActivity[] = [
  listed("a-nasu", "那須〜日光", "2026-08-30T08:00:00", 86000, 969, 307, [139.75, 36.85], "#b8430b", [
    ["n1", 0.3, "#5a8c6a"],
    ["n2", null, "#8a7a5a"],
  ]),
  listed("a-misaka", "御坂峠", "2026-06-06T08:00:00", 39000, 629, 144, [138.7, 35.55], "#1d4ed8"),
  listed("a-togakushi-1", "戸隠ヒルクラ", "2026-05-10T08:00:00", 22000, 897, 116, [138.08, 36.75], "#0f766e", [
    ["t1", 0.5, "#a87a4a"],
  ], "t-togakushi"),
  listed("a-togakushi-2", "戸隠ダウンヒル（失敗）", "2026-05-11T08:00:00", 14000, 70, 118, [138.12, 36.72], "#7c3aed", [
    ["t2", 0.2, "#6a8a8a"],
  ], "t-togakushi"),
  listed("a-zushi", "逗子ゆるぽた", "2026-04-12T08:00:00", 48000, 686, 185, [139.58, 35.3], "#b45309"),
  listed("a-fuji", "富士山一周", "2025-10-04T08:00:00", 25000, 410, 140, [138.73, 35.36], "#2f6f8f"),
];
