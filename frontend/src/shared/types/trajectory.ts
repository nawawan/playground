export type LineString = {
  type: "LineString";
  coordinates: [number, number][];
}


export type ActivityResponse = {
    id: string;
    name: string;
    distance: number;
    duration: number;
    elevation_gain: number;
    start_time: string;
    trajectory:  LineString | null;
    elevations: number[];
};
