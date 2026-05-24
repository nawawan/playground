import { Box, Button } from "@mui/material";
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
  <Box className="trajectry-page" component="main">
    <Header onUpload={onOpenUpload} />
    <Box className="trajectry-page__body">
      <TrajectrySideBar
        activeId={activeId}
        activities={activities}
        onSelectActivity={onSelectActivity}
        onUpload={onOpenUpload}
      />
      <Box className="trajectry-page__center" component="section">
        <Box className="trajectry-page__map-shell">
          <Box className="trajectry-style-switcher" aria-label="map style">
            {(["terrain", "streets", "sepia"] as const).map((style) => (
              <Button
                className={style === mapStyle ? "is-active" : ""}
                disableRipple
                key={style}
                onClick={() => onMapStyleChange(style)}
                type="button"
              >
                {style}
              </Button>
            ))}
          </Box>
          <MapArea
            activePhotoId={activePhotoId}
            activity={activeActivity}
            here={here}
            mapStyle={mapStyle}
            onPhotoSelect={onSelectPhoto}
          />
        </Box>
        <TrajectryHeight
          activePhotoId={activePhotoId}
          activity={activeActivity}
          here={here}
          onHereChange={onHereChange}
          onPhotoSelect={onSelectPhoto}
        />
      </Box>
      <Box className="trajectry-page__right" component="aside">
        <TrajectryDetail activity={activeActivity} />
        <ImagePanel
          activePhotoId={activePhotoId}
          activity={activeActivity}
          here={here}
          onPhotoSelect={onSelectPhoto}
        />
      </Box>
    </Box>
    <UploadModal onClose={onCloseUpload} open={uploadOpen} />
  </Box>
);
