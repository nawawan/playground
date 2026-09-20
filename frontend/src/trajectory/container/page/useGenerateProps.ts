import { useMemo, useState } from "react";

import type { MapStyleKey, TrajectoryActivity } from "../../domain/types";

export const useGenerateTrajectoryPageProps = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activities, setActivities] = useState<TrajectoryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const activeActivity = useMemo(
    () => activities.find((activity) => activity.id === activeId) ?? activities[0] ?? null,
    [activities, activeId],
  );
  const [here, setHere] = useState(0.5);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("terrain");
  const [uploadOpen, setUploadOpen] = useState(false);

  const selectActivity = (activityId: string) => {
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
    setActivities((prev) => [...newActivities, ...prev]);

    const first = newActivities[0];
    if (activeId === null && first) {
      const initialPhoto = first.photos[2] ?? first.photos[0] ?? null;
      setActiveId(first.id);
      setHere(initialPhoto?.at ?? 0.5);
      setActivePhotoId(initialPhoto?.id ?? null);
    }
  };

  return {
    activities,
    activeActivity,
    activeId,
    activePhotoId,
    here,
    loading,
    mapStyle,
    uploadOpen,
    onCloseUpload: () => setUploadOpen(false),
    onHereChange: setHere,
    onMapStyleChange: setMapStyle,
    onOpenUpload: () => setUploadOpen(true),
    onSelectActivity: selectActivity,
    onSelectPhoto: selectPhoto,
    addActivities: addActivity,
    finishLoading: () => setLoading(false),
  };
};
