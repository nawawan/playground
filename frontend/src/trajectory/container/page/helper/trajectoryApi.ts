import {
  toTrajectoryPhoto,
  toTravel,
  type ActivityResponse,
  type PhotoResponse,
  type PhotoUploadItemResponse,
  type TravelResponse,
} from "../../../../shared/types/trajectory";
import type { CameraTimeZone, TrajectoryPhoto, Travel } from "../../../domain/types";

const JSON_HEADERS = { "Content-Type": "application/json" };

const ensureOk = (res: Response, what: string) => {
  if (!res.ok) throw new Error(`Failed to ${what}: ${res.status}`);
};

export const fetchTravels = async (): Promise<Travel[]> => {
  const res = await fetch("/api/travels");
  ensureOk(res, "fetch travels");
  return ((await res.json()) as TravelResponse[]).map(toTravel);
};

export const fetchPhotos = async (): Promise<TrajectoryPhoto[]> => {
  const res = await fetch("/api/photos");
  ensureOk(res, "fetch photos");
  return ((await res.json()) as PhotoResponse[]).map(toTrajectoryPhoto);
};

// ---- admin ----

export const createTravel = async (name: string): Promise<Travel> => {
  const res = await fetch("/api/admin/travels", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ name }),
  });
  ensureOk(res, "create travel");
  return toTravel((await res.json()) as TravelResponse);
};

// travelId null makes the activity standalone. Returns the travel id the backend stored.
export const setActivityTravel = async (activityId: string, travelId: string | null): Promise<string | null> => {
  const res = await fetch(`/api/admin/activities/${encodeURIComponent(activityId)}`, {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ travel_id: travelId }),
  });
  ensureOk(res, "update activity");
  return ((await res.json()) as ActivityResponse).travel_id ?? null;
};

// One photo per request (Cloud Run rejects requests over 32MB).
// `timeZone` is the time zone of the camera clock, for photos whose EXIF has no offset.
export const uploadPhoto = async (
  activityId: string,
  file: File,
  timeZone: CameraTimeZone,
): Promise<PhotoUploadItemResponse> => {
  const form = new FormData();
  form.append("time_zone", timeZone);
  form.append("image", file, file.name);
  const res = await fetch(`/api/admin/activities/${encodeURIComponent(activityId)}/photos`, {
    method: "POST",
    body: form,
  });
  ensureOk(res, "upload photo");
  const [item] = (await res.json()) as PhotoUploadItemResponse[];
  return item ?? { file_name: file.name, photo: null, error: "no result" };
};

export const placePhoto = async (photoId: string, distanceM: number): Promise<TrajectoryPhoto> => {
  const res = await fetch(`/api/admin/photos/${encodeURIComponent(photoId)}`, {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ distance_m: distanceM }),
  });
  ensureOk(res, "place photo");
  return toTrajectoryPhoto((await res.json()) as PhotoResponse);
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  const res = await fetch(`/api/admin/photos/${encodeURIComponent(photoId)}`, { method: "DELETE" });
  ensureOk(res, "delete photo");
};
