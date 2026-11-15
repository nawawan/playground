import {
    type PhotoPositionSource,
    type TrajectoryActivity,
    type TrajectoryPhoto,
    type Travel,
} from "../../trajectory/domain/types";

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
    // null for a standalone activity. string: ids exceed Number.MAX_SAFE_INTEGER.
    travel_id: string | null;
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
    travelId: activity.travel_id ?? null,
    photos: [],
});

export type TravelResponse = {
    id: string;
    name: string;
};

export const toTravel = (travel: TravelResponse): Travel => ({ id: travel.id, name: travel.name });

export type PhotoResponse = {
    id: string;
    activity_id: string;
    url: string;
    thumbnail_url: string;
    // Meters from the start of the activity. null while the photo is not placed.
    distance_m: number | null;
    lng: number | null;
    lat: number | null;
    position_source: PhotoPositionSource | null;
    taken_at: string | null;
};

// One entry per uploaded file: either `photo` or `error` is set.
export type PhotoUploadItemResponse = {
    file_name: string;
    photo: PhotoResponse | null;
    error: string | null;
};

export const toTrajectoryPhoto = (photo: PhotoResponse): TrajectoryPhoto => ({
    id: photo.id,
    activityId: photo.activity_id,
    url: photo.url,
    thumbnailUrl: photo.thumbnail_url,
    distanceM: photo.distance_m,
    lng: photo.lng,
    lat: photo.lat,
    source: photo.position_source,
    takenAt: photo.taken_at,
    // Resolved against the track that is currently shown (see domain/photoPosition).
    at: null,
});
