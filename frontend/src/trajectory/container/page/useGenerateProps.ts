import { useMemo, useState } from "react";

import { applyLodOverride } from "../../domain/lod";
import { ALL_ACTIVITY_ID, type LodOverrides, type MapStyleKey, type TrajectoryActivity } from "../../domain/types";

export const useGenerateTrajectoryPageProps = () => {
  const [activeId, setActiveId] = useState<string>(ALL_ACTIVITY_ID);
  const [lodOverrides, setLodOverrides] = useState<LodOverrides>({});
  const [activities, setActivities] = useState<TrajectoryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const viewMode: "all" | "single" = activeId === ALL_ACTIVITY_ID ? "all" : "single";
  const activeActivity = useMemo(() => {
    if (viewMode === "all") return null;
    const activity = activities.find((item) => item.id === activeId);
    return activity ? applyLodOverride(activity, lodOverrides) : null;
  }, [activities, activeId, lodOverrides, viewMode]);
  const [here, setHere] = useState(0.5);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("terrain");
  const [uploadOpen, setUploadOpen] = useState(false);

  const selectActivity = (activityId: string) => {
    // LOD overrides belong to the previous view; they are refetched for the new one.
    setLodOverrides({});
    setHere(0.5);
    setActivePhotoId(null);

    if (activityId === ALL_ACTIVITY_ID) {
      setActiveId(ALL_ACTIVITY_ID);
      return;
    }

    const nextActivity = activities.find((activity) => activity.id === activityId);
    if (!nextActivity) return;

    setActiveId(activityId);
    const nextPhoto = nextActivity.photos[0] ?? null;
    setHere(nextPhoto?.at ?? 0.5);
    setActivePhotoId(nextPhoto?.id ?? null);
  };

  const selectPhoto = (photoId: string) => {
    if (!activeActivity) return;
    const nextPhoto = activeActivity.photos.find((photo) => photo.id === photoId);
    setActivePhotoId(photoId);
    if (nextPhoto) setHere(nextPhoto.at);
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

  return {
    activities,
    activeActivity,
    activeId,
    activePhotoId,
    viewMode,
    lodOverrides,
    here,
    loading,
    mapStyle,
    uploadOpen,
    onCloseUpload: () => setUploadOpen(false),
    onLodOverridesChange: changeLodOverrides,
    onHereChange: setHere,
    onMapStyleChange: setMapStyle,
    onOpenUpload: () => setUploadOpen(true),
    onSelectActivity: selectActivity,
    onSelectPhoto: selectPhoto,
    addActivities: addActivity,
    finishLoading: () => setLoading(false),
  };
};
