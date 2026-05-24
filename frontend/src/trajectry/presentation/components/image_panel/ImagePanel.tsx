import { Box, Button, ImageList, ImageListItem, Paper, Stack, Typography } from "@mui/material";
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
  <Paper className="trajectry-stat-tile" elevation={0}>
    <Typography className="trajectry-mono trajectry-stat-tile__label" component="div">
      {label}
    </Typography>
    <Typography className="trajectry-stat-tile__value" component="div">
      {value}
    </Typography>
  </Paper>
);

export const ImagePanel = ({ activity, activePhotoId, here, onPhotoSelect }: ImagePanelProps) => {
  const hereElevation = Math.round(elevationAt(activity.elevation, here));
  const hereKm = formatKmAt(activity.km, here);

  return (
    <Stack className="trajectry-image-panel" spacing={4}>
      <Stack className="trajectry-image-panel__stats" direction="row" spacing={1}>
        <StatTile label="elev here" value={`${hereElevation}m`} />
        <StatTile label="at" value={`${hereKm} / ${activity.km}km`} />
      </Stack>
      {activity.note && activity.note !== "—" && (
        <Paper className="trajectry-image-panel__note" elevation={0}>
          "{activity.note}"
        </Paper>
      )}
      <Stack>
        <Stack className="trajectry-mono trajectry-image-panel__grid-title" direction="row" justifyContent="space-between">
          <Typography component="span">PHOTOS</Typography>
          <Typography component="span">{activity.photos.length}</Typography>
        </Stack>
        <ImageList className="trajectry-image-panel__grid" cols={2} gap={16}>
          {activity.photos.map((photo) => (
            <ImageListItem key={photo.id}>
              <Button
                aria-label={photo.caption}
                className={`trajectry-image-panel__thumb${photo.id === activePhotoId ? " is-active" : ""}`}
                disableRipple
                onClick={() => onPhotoSelect(photo.id)}
                style={{ background: photoBackground(photo.color) }}
                type="button"
              >
                {photo.id === activePhotoId && <Box aria-hidden="true" component="i" />}
                <Typography component="span">{photo.stamp}</Typography>
              </Button>
            </ImageListItem>
          ))}
          <ImageListItem>
            <Button className="trajectry-image-panel__add" disableRipple type="button">
              +
            </Button>
          </ImageListItem>
        </ImageList>
      </Stack>
    </Stack>
  );
};
