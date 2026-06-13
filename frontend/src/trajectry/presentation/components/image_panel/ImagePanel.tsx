import { Box, Button, ImageList, ImageListItem, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
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

const PanelRoot = styled(Stack)({
  flex: 1,
  overflowY: "auto",
  padding: "32px 38px",
});

const Note = styled(Paper)({
  background: "rgba(139, 111, 71, 0.04)",
  borderLeft: "4px solid var(--accent)",
  color: "var(--ink-2)",
  fontSize: 18,
  lineHeight: 1.65,
  padding: "20px 28px",
});

const StatPaper = styled(Paper)({
  background: "var(--paper-2)",
  border: "1px solid var(--rule)",
  borderRadius: 8,
  flex: 1,
  minWidth: 0,
  padding: "20px 20px 18px",
});

const StatLabel = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

const StatValue = styled(Typography)({
  color: "var(--ink)",
  fontSize: 26,
  fontWeight: 900,
  lineHeight: 1.2,
  marginTop: 12,
  overflowWrap: "anywhere",
});

const GridTitle = styled(Stack)({
  alignItems: "center",
  color: "var(--ink-soft)",
  fontSize: 17,
  fontWeight: 700,
  letterSpacing: "0.18em",
  marginBottom: 18,
});

const PhotoList = styled(ImageList)({
  margin: 0,
});

const PhotoButton = styled(Button)({
  aspectRatio: "1",
  border: "1.5px solid var(--rule-strong)",
  borderRadius: 10,
  cursor: "pointer",
  overflow: "hidden",
  padding: 0,
  position: "relative",
  "&.is-active": {
    border: "3px solid var(--pin)",
  },
  "& i": {
    background: "var(--paper)",
    border: "4px solid var(--pin)",
    borderRadius: "50%",
    height: 14,
    position: "absolute",
    right: 10,
    top: 10,
    width: 14,
    zIndex: 2,
  },
  "& span": {
    background: "rgba(42, 38, 34, 0.58)",
    borderRadius: 5,
    bottom: 14,
    color: "#fff",
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 15,
    fontWeight: 700,
    left: 14,
    padding: "4px 8px",
    position: "absolute",
  },
});

const AddButton = styled(Button)({
  aspectRatio: "1",
  background: "transparent",
  border: "1.5px dashed var(--rule-strong)",
  borderRadius: 10,
  color: "var(--ink-soft)",
  cursor: "pointer",
  fontSize: 22,
  fontWeight: 700,
  padding: 0,
  position: "relative",
});

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <StatPaper elevation={0}>
    <StatLabel className="trajectry-mono">
      {label}
    </StatLabel>
    <StatValue>
      {value}
    </StatValue>
  </StatPaper>
);

export const ImagePanel = ({ activity, activePhotoId, here, onPhotoSelect }: ImagePanelProps) => {
  const hereElevation = Math.round(elevationAt(activity.elevation, here));
  const hereKm = formatKmAt(activity.km, here);

  return (
    <PanelRoot spacing={4}>
      <Stack alignItems="stretch" direction="row" spacing={1}>
        <StatTile label="elev here" value={`${hereElevation}m`} />
        <StatTile label="at" value={`${hereKm} / ${activity.km}km`} />
      </Stack>
      {activity.note && activity.note !== "—" && (
        <Note elevation={0}>
          "{activity.note}"
        </Note>
      )}
      <Stack>
        <GridTitle className="trajectry-mono" direction="row" justifyContent="space-between">
          <Typography component="span">PHOTOS</Typography>
          <Typography component="span">{activity.photos.length}</Typography>
        </GridTitle>
        <PhotoList cols={2} gap={16}>
          {activity.photos.map((photo) => (
            <ImageListItem key={photo.id}>
              <PhotoButton
                aria-label={photo.caption}
                className={photo.id === activePhotoId ? "is-active" : ""}
                disableRipple
                onClick={() => onPhotoSelect(photo.id)}
                style={{ background: photoBackground(photo.color) }}
                type="button"
              >
                {photo.id === activePhotoId && <Box aria-hidden="true" component="i" />}
                <Typography component="span">{photo.stamp}</Typography>
              </PhotoButton>
            </ImageListItem>
          ))}
          <ImageListItem>
            <AddButton disableRipple type="button">
              +
            </AddButton>
          </ImageListItem>
        </PhotoList>
      </Stack>
    </PanelRoot>
  );
};
