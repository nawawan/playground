import { Box, Button, Typography } from "@mui/material";
import { elevationAt, formatKmAt } from "../../../domain/geo";
import type { TrajectryActivity } from "../../../domain/types";

type ImagePanelProps = {
  activity: TrajectryActivity;
  activePhotoId: string | null;
  here: number;
  onPhotoSelect: (photoId: string) => void;
};

const photoBackground = (color: string) =>
  `repeating-linear-gradient(135deg, ${color}cc 0 8px, ${color}99 8px 16px)`;

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <Box className="trajectry-stat-tile">
    <Typography className="trajectry-mono trajectry-stat-tile__label" component="div">
      {label}
    </Typography>
    <Typography className="trajectry-stat-tile__value" component="div">
      {value}
    </Typography>
  </Box>
);

export const ImagePanel = ({ activity, activePhotoId, here, onPhotoSelect }: ImagePanelProps) => {
  const hereElevation = Math.round(elevationAt(activity.elevation, here));
  const hereKm = formatKmAt(activity.km, here);

  return (
    <Box className="trajectry-image-panel">
      <Box className="trajectry-image-panel__stats">
        <StatTile label="elev here" value={`${hereElevation}m`} />
        <StatTile label="at" value={`${hereKm} / ${activity.km}km`} />
      </Box>
      {activity.note && activity.note !== "—" && (
        <Typography className="trajectry-image-panel__note" component="div">
          "{activity.note}"
        </Typography>
      )}
      <Box>
        <Box className="trajectry-mono trajectry-image-panel__grid-title">
          <Typography component="span">PHOTOS</Typography>
          <Typography component="span">{activity.photos.length}</Typography>
        </Box>
        <Box className="trajectry-image-panel__grid">
          {activity.photos.map((photo) => (
            <Button
              aria-label={photo.caption}
              className={`trajectry-image-panel__thumb${photo.id === activePhotoId ? " is-active" : ""}`}
              disableRipple
              key={photo.id}
              onClick={() => onPhotoSelect(photo.id)}
              style={{ background: photoBackground(photo.color) }}
              type="button"
            >
              {photo.id === activePhotoId && <Box aria-hidden="true" component="i" />}
              <Typography component="span">{photo.stamp}</Typography>
            </Button>
          ))}
          <Button className="trajectry-image-panel__add" disableRipple type="button">
            +
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
