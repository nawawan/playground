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
