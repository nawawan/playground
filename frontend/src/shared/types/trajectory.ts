import { type TrajectoryActivity } from "../../trajectory/domain/types";

export type LineString = {
  type: "LineString";
  coordinates: [number, number][];
}


export type ActivityResponse = {
    // string: ids exceed Number.MAX_SAFE_INTEGER, so a JSON number would be rounded.
    id: string;
    name: string;
    distance: number;
    duration: number;
    elevation_gain: number;
    start_time: string;
    trajectory:  LineString | null;
    elevations: number[];
};

// A trajectory of one activity at one LOD level. `elevations` is only present
// for the single-activity endpoint (GET /api/activities/{id}/trajectory).
export type LodTrajectoryResponse = {
    activity_id: string;
    lod: number;
    trajectory: LineString;
    elevations?: number[];
};

export const toTrajectoryActivity = (activity: ActivityResponse): TrajectoryActivity => ({
    id: activity.id,
    title: activity.name,
    type: "bike",
    subtitle: "",
    date: activity.start_time,
    km: activity.distance,
    gain: activity.elevation_gain,
    duration: activity.duration.toString(),
    note: "",
    color: "var(--accent)",
    center: activity.trajectory?.coordinates[0] ?? [1, 1],
    zoom: 1,
    track: activity.trajectory?.coordinates ?? [],
    elevation: activity.elevations ?? [],
    photos: [],
});
