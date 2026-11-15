import * as Sentry from "@sentry/react";
import { useMemo, useState } from "react";

import { toTrajectoryPhoto } from "../../../shared/types/trajectory";
import { applyLodOverride } from "../../domain/lod";
import { distanceFromAt, withPhotos } from "../../domain/photoPosition";
import { composeTravel, isTravelSelectionId, travelIdOfSelection, travelSelectionId } from "../../domain/travel";
import {
  ALL_ACTIVITY_ID,
  type LodOverrides,
  type MapStyleKey,
  type PhotoUploadStatus,
  type TrajectoryActivity,
  type TrajectoryPhoto,
  type Travel,
} from "../../domain/types";
import { createTravel, deletePhoto, placePhoto, setActivityTravel, uploadPhoto } from "./helper/trajectoryApi";
import type { TrajectoryViewMode } from "../../presentation/page/TrajectoryPage";

const report = (what: string, e: unknown) =>
  Sentry.captureException(new Error(`Failed to ${what}: ` + (e instanceof Error ? e.message : String(e))));

export const useGenerateTrajectoryPageProps = () => {
  const [activeId, setActiveId] = useState<string>(ALL_ACTIVITY_ID);
  const [lodOverrides, setLodOverrides] = useState<LodOverrides>({});
  const [activities, setActivities] = useState<TrajectoryActivity[]>([]);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [photos, setPhotos] = useState<TrajectoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [here, setHere] = useState(0.5);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [placingPhotoId, setPlacingPhotoId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("terrain");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [photoUpload, setPhotoUpload] = useState<PhotoUploadStatus>({ uploading: false, failures: [] });

  const viewMode: TrajectoryViewMode =
    activeId === ALL_ACTIVITY_ID ? "all" : isTravelSelectionId(activeId) ? "travel" : "single";

  const showTrack = (activity: TrajectoryActivity) => withPhotos(applyLodOverride(activity, lodOverrides), photos);

  const selectedActivities = useMemo(() => {
    if (viewMode === "single") return activities.filter((activity) => activity.id === activeId);
    if (viewMode === "travel") {
      const travelId = travelIdOfSelection(activeId);
      return activities.filter((activity) => activity.travelId === travelId);
    }
    return [];
  }, [activities, activeId, viewMode]);

  const activeActivity = useMemo(() => {
    if (viewMode === "all" || selectedActivities.length === 0) return null;
    if (viewMode === "single") return showTrack(selectedActivities[0]);
    const travel = travels.find((item) => travelSelectionId(item.id) === activeId);
    return travel ? composeTravel(travel, selectedActivities.map(showTrack)) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActivities, travels, activeId, lodOverrides, photos, viewMode]);

  const resetSelectionState = () => {
    // LOD overrides belong to the previous view; they are refetched for the new one.
    setLodOverrides({});
    setHere(0.5);
    setActivePhotoId(null);
    setPlacingPhotoId(null);
  };

  const selectActivity = (activityId: string) => {
    resetSelectionState();

    if (activityId === ALL_ACTIVITY_ID) {
      setActiveId(ALL_ACTIVITY_ID);
      return;
    }

    const nextActivity = activities.find((activity) => activity.id === activityId);
    if (!nextActivity) return;

    setActiveId(activityId);
    const nextPhoto = withPhotos(nextActivity, photos).photos.find((photo) => photo.at !== null) ?? null;
    setHere(nextPhoto?.at ?? 0.5);
    setActivePhotoId(nextPhoto?.id ?? null);
  };

  const selectTravel = (travelId: string) => {
    if (!activities.some((activity) => activity.travelId === travelId)) return;
    resetSelectionState();
    setActiveId(travelSelectionId(travelId));
  };

  const selectPhoto = (photoId: string) => {
    if (!activeActivity) return;
    const nextPhoto = activeActivity.photos.find((photo) => photo.id === photoId);
    setActivePhotoId(photoId);
    if (nextPhoto?.at != null) setHere(nextPhoto.at);
  };

  const addActivity = (newActivities: TrajectoryActivity[]) => {
    setActivities((prev) => {
      // The initial fetch can run twice (StrictMode); never list an activity twice.
      const known = new Set(prev.map((activity) => activity.id));
      return [...newActivities.filter((activity) => !known.has(activity.id)), ...prev];
    });
  };

  const changeLodOverrides = (next: LodOverrides) =>
    setLodOverrides((prev) => (Object.keys(prev).length === 0 && Object.keys(next).length === 0 ? prev : next));

  // ---- admin ----

  const createTravelAction = async (name: string) => {
    try {
      const travel = await createTravel(name);
      setTravels((prev) => [...prev.filter((item) => item.id !== travel.id), travel]);
    } catch (e) {
      report("create travel", e);
      throw e;
    }
  };

  const changeTravelAction = async (activityId: string, travelId: string | null) => {
    try {
      const stored = await setActivityTravel(activityId, travelId);
      setActivities((prev) =>
        prev.map((activity) => (activity.id === activityId ? { ...activity, travelId: stored } : activity)),
      );
    } catch (e) {
      report("update activity", e);
      throw e;
    }
  };

  const uploadPhotosAction = async (files: File[], clockOffsetSeconds: number) => {
    // Photos belong to one activity, so only a single activity can be the target.
    if (viewMode !== "single" || files.length === 0) return;
    const activityId = activeId;
    setPhotoUpload({ uploading: true, failures: [] });
    const failures: PhotoUploadStatus["failures"] = [];
    for (const file of files) {
      try {
        const item = await uploadPhoto(activityId, file, clockOffsetSeconds);
        if (item.photo) {
          const stored = toTrajectoryPhoto(item.photo);
          setPhotos((prev) => [...prev.filter((photo) => photo.id !== stored.id), stored]);
        } else {
          failures.push({ fileName: file.name, reason: item.error ?? "unknown error" });
        }
      } catch (e) {
        report("upload photo", e);
        failures.push({ fileName: file.name, reason: "アップロードに失敗しました" });
      }
    }
    setPhotoUpload({ uploading: false, failures });
  };

  const placePhotoAction = async (at: number) => {
    if (!placingPhotoId || viewMode !== "single" || !activeActivity) return;
    const photoId = placingPhotoId;
    try {
      const distanceM = distanceFromAt(activeActivity.track, activeActivity.km, at);
      const placed = await placePhoto(photoId, distanceM);
      setPhotos((prev) => prev.map((photo) => (photo.id === photoId ? placed : photo)));
      setPlacingPhotoId(null);
      setHere(at);
      setActivePhotoId(photoId);
    } catch (e) {
      report("place photo", e);
    }
  };

  const deletePhotoAction = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      setActivePhotoId((prev) => (prev === photoId ? null : prev));
      setPlacingPhotoId((prev) => (prev === photoId ? null : prev));
    } catch (e) {
      report("delete photo", e);
    }
  };

  return {
    activities,
    travels,
    activeActivity,
    activeId,
    selectedActivityIds: selectedActivities.map((activity) => activity.id),
    activePhotoId,
    placingPhotoId,
    viewMode,
    lodOverrides,
    here,
    loading,
    mapStyle,
    uploadOpen,
    photoUpload,
    onCloseUpload: () => setUploadOpen(false),
    onLodOverridesChange: changeLodOverrides,
    onHereChange: setHere,
    onMapStyleChange: setMapStyle,
    onOpenUpload: () => setUploadOpen(true),
    onSelectActivity: selectActivity,
    onSelectTravel: selectTravel,
    onSelectPhoto: selectPhoto,
    addActivities: addActivity,
    loadTravels: setTravels,
    loadPhotos: setPhotos,
    finishLoading: () => setLoading(false),
    onCreateTravel: createTravelAction,
    onChangeTravel: changeTravelAction,
    onUploadPhotos: uploadPhotosAction,
    onStartPlacing: setPlacingPhotoId,
    onCancelPlacing: () => setPlacingPhotoId(null),
    onPlacePhoto: placePhotoAction,
    onDeletePhoto: deletePhotoAction,
  };
};
