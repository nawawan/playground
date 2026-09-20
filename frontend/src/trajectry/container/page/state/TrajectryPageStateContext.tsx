import { createContext } from "react";
import type { MapStyleKey, TrajectryActivity } from "../../../domain/types";

type TrajectryPageState = {
  activities: TrajectryActivity[];
  activeActivity: TrajectryActivity | null;
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
  addActivities: (activities: TrajectryActivity[]) => void;
  finishLoading: () => void;
};

export const TrajectryPageStateContext = createContext<TrajectryPageState | null>(null);
