import { createContext } from "react";
import type { MapStyleKey, TrajectoryActivity } from "../../../domain/types";

type TrajectoryPageState = {
  activities: TrajectoryActivity[];
  activeActivity: TrajectoryActivity | null;
  activeId: string | null;
  activePhotoId: string | null;
  here: number;
  loading: boolean;
  mapStyle: MapStyleKey;
  uploadOpen: boolean;
  onCloseUpload: () => void;
  onHereChange: (here: number) => void;
  onMapStyleChange: (style: MapStyleKey) => void;
  onOpenUpload: () => void;
  onSelectActivity: (activityId: string) => void;
  onSelectPhoto: (photoId: string) => void;
  addActivities: (activities: TrajectoryActivity[]) => void;
  finishLoading: () => void;
};

export const TrajectoryPageStateContext = createContext<TrajectoryPageState | null>(null);
