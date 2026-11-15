import { createContext } from "react";
import type {
  CameraTimeZone,
  LodOverrides,
  MapStyleKey,
  PhotoUploadStatus,
  TrajectoryActivity,
  TrajectoryPhoto,
  Travel,
} from "../../../domain/types";
import type { TrajectoryViewMode } from "../../../presentation/page/TrajectoryPage";

type TrajectoryPageState = {
  activities: TrajectoryActivity[];
  travels: Travel[];
  // The selection as shown: the activity, or the travel joined into one activity.
  activeActivity: TrajectoryActivity | null;
  activeId: string;
  // The activities behind the selection (one, or a travel's), used to fetch detailed tracks.
  selectedActivityIds: string[];
  viewMode: TrajectoryViewMode;
  lodOverrides: LodOverrides;
  activePhotoId: string | null;
  // Set while the admin is choosing where on the elevation chart this photo belongs.
  placingPhotoId: string | null;
  here: number;
  loading: boolean;
  mapStyle: MapStyleKey;
  uploadOpen: boolean;
  photoUpload: PhotoUploadStatus;
  onCloseUpload: () => void;
  onLodOverridesChange: (overrides: LodOverrides) => void;
  onHereChange: (here: number) => void;
  onMapStyleChange: (style: MapStyleKey) => void;
  onOpenUpload: () => void;
  onSelectActivity: (activityId: string) => void;
  onSelectTravel: (travelId: string) => void;
  onSelectPhoto: (photoId: string) => void;
  addActivities: (activities: TrajectoryActivity[]) => void;
  loadTravels: (travels: Travel[]) => void;
  loadPhotos: (photos: TrajectoryPhoto[]) => void;
  finishLoading: () => void;
  // ---- admin ----
  onCreateTravel: (name: string) => Promise<void>;
  onChangeTravel: (activityId: string, travelId: string | null) => Promise<void>;
  onUploadPhotos: (files: File[], timeZone: CameraTimeZone) => Promise<void>;
  onStartPlacing: (photoId: string) => void;
  onCancelPlacing: () => void;
  // `at`: where on the elevation chart (0..1) the photo was put.
  onPlacePhoto: (at: number) => Promise<void>;
  onDeletePhoto: (photoId: string) => Promise<void>;
};

export const TrajectoryPageStateContext = createContext<TrajectoryPageState | null>(null);
