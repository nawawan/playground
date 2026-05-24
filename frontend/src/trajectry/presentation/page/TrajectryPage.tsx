import type { MapStyleKey, TrajectryActivity } from "../../domain/types";
import { Header } from "../components/header/Header";
import { ImagePanel } from "../components/image_panel/ImagePanel";
import { MapArea } from "../components/map_area/MapArea";
import { TrajectryDetail } from "../components/trajectry_detail/TrajectryDetail";
import { TrajectryHeight } from "../components/trajectry_height/TrajectryHeight";
import { TrajectrySideBar } from "../components/trajectry_side_bar/TrajectrySideBar";
import { UploadModal } from "../components/upload_modal/UploadModal";
import "./TrajectryPage.css";

type TrajectryPageProps = {
  activities: TrajectryActivity[];
  activeActivity: TrajectryActivity;
  activeId: string;
  activePhotoId: string | null;
  here: number;
  mapStyle: MapStyleKey;
  uploadOpen: boolean;
  onCloseUpload: () => void;
  onHereChange: (here: number) => void;
  onMapStyleChange: (style: MapStyleKey) => void;
  onOpenUpload: () => void;
  onSelectActivity: (activityId: string) => void;
  onSelectPhoto: (photoId: string) => void;
};

export const TrajectryPage = ({
  activities,
  activeActivity,
  activeId,
  activePhotoId,
  here,
  mapStyle,
  uploadOpen,
  onCloseUpload,
  onHereChange,
  onMapStyleChange,
  onOpenUpload,
  onSelectActivity,
  onSelectPhoto,
}: TrajectryPageProps) => (
  <main className="trajectry-page">
    <Header onUpload={onOpenUpload} />
    <div className="trajectry-page__body">
      <TrajectrySideBar
        activeId={activeId}
        activities={activities}
        onSelectActivity={onSelectActivity}
        onUpload={onOpenUpload}
      />
      <section className="trajectry-page__center">
        <div className="trajectry-page__map-shell">
          <div className="trajectry-style-switcher" aria-label="map style">
            {(["terrain", "streets", "sepia"] as const).map((style) => (
              <button
                className={style === mapStyle ? "is-active" : ""}
                key={style}
                onClick={() => onMapStyleChange(style)}
                type="button"
              >
                {style}
              </button>
            ))}
          </div>
          <MapArea
            activePhotoId={activePhotoId}
            activity={activeActivity}
            here={here}
            mapStyle={mapStyle}
            onPhotoSelect={onSelectPhoto}
          />
        </div>
        <TrajectryHeight
          activePhotoId={activePhotoId}
          activity={activeActivity}
          here={here}
          onHereChange={onHereChange}
          onPhotoSelect={onSelectPhoto}
        />
      </section>
      <aside className="trajectry-page__right">
        <TrajectryDetail activity={activeActivity} />
        <ImagePanel
          activePhotoId={activePhotoId}
          activity={activeActivity}
          here={here}
          onPhotoSelect={onSelectPhoto}
        />
      </aside>
    </div>
    <UploadModal onClose={onCloseUpload} open={uploadOpen} />
  </main>
);
