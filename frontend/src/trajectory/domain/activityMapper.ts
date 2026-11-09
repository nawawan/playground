import type { ActivityResponse } from "../../shared/types/trajectory";
import type { TrajectoryActivity } from "./types";

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
