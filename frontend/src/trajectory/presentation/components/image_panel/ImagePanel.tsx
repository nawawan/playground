import { Box, Button, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef, useState } from "react";
import { formatKm, photoLabel, photoPlace } from "../../../domain/format";
import { elevationAt, formatKmAt } from "../../../domain/geo";
import type { CameraTimeZone, PhotoUploadStatus, TrajectoryActivity, TrajectoryPhoto } from "../../../domain/types";

type ImagePanelProps = {
  activity: TrajectoryActivity;
  activePhotoId: string | null;
  here: number;
  onPhotoSelect: (photoId: string) => void;
  // Admin on a single activity: photos can be uploaded, placed and deleted.
  canEdit?: boolean;
  // The photo whose position is being chosen on the elevation chart.
  placingPhotoId?: string | null;
  uploadStatus?: PhotoUploadStatus;
  onUploadFiles?: (files: File[], timeZone: CameraTimeZone) => void;
  onStartPlacing?: (photoId: string) => void;
  onCancelPlacing?: () => void;
  onDeletePhoto?: (photoId: string) => void;
};

const PanelRoot = styled(Stack)({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: 20,
});

const Note = styled(Paper)({
  background: "var(--paper-2)",
  borderLeft: "3px solid var(--ink-faint)",
  color: "var(--ink-soft)",
  fontSize: 13,
  lineHeight: 1.6,
  padding: "10px 14px",
});

const StatGrid = styled(Box)({
  display: "grid",
  gap: 10,
  gridTemplateColumns: "1fr 1fr",
});

const StatTile = styled(Paper)({
  background: "var(--paper)",
  border: "1px solid var(--rule)",
  borderRadius: 12,
  padding: "10px 12px",
});

const StatLabel = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 11,
  letterSpacing: 0.3,
});

const StatValue = styled(Typography)({
  color: "var(--ink)",
  fontSize: 22,
  fontWeight: 700,
  marginTop: 2,
});

const GridTitle = styled(Stack)({
  color: "var(--ink)",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 0.3,
  marginBottom: 10,
});

const PhotoGrid = styled(Box)({
  display: "grid",
  gap: 12,
  gridTemplateColumns: "1fr 1fr",
});

const Tile = styled(Box)({
  aspectRatio: "1",
  borderRadius: 10,
  overflow: "hidden",
  position: "relative",
});

const PhotoButton = styled(Button)({
  background: "var(--paper-2)",
  borderRadius: 10,
  cursor: "pointer",
  height: "100%",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  inset: 0,
  width: "100%",
  "& img": {
    display: "block",
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
});

const Chip = styled("span")({
  background: "rgba(26, 26, 26, 0.65)",
  borderRadius: 6,
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  padding: "3px 8px",
  pointerEvents: "none",
  position: "absolute",
});

const ActiveDot = styled("i")({
  background: "var(--pin)",
  border: "2px solid var(--paper)",
  borderRadius: "50%",
  height: 14,
  left: 8,
  pointerEvents: "none",
  position: "absolute",
  top: 8,
  width: 14,
});

const Pill = styled(Button)({
  background: "var(--ink)",
  borderRadius: 999,
  bottom: 8,
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  left: "50%",
  padding: "5px 12px",
  position: "absolute",
  transform: "translateX(-50%)",
  whiteSpace: "nowrap",
  "&:hover": { background: "var(--ink)" },
});

const CornerButton = styled(Button)({
  background: "rgba(255, 255, 255, 0.92)",
  borderRadius: 6,
  color: "var(--ink)",
  fontSize: 11,
  fontWeight: 700,
  padding: "2px 6px",
  position: "absolute",
  "&:hover": { background: "#fff" },
});

const DropZone = styled(Button)({
  background: "transparent",
  border: "1.5px dashed var(--ink-faint)",
  borderRadius: 12,
  color: "var(--ink-soft)",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  fontSize: 12,
  gap: 4,
  lineHeight: 1.6,
  padding: "16px 14px",
  textAlign: "center",
  width: "100%",
});

const Stat = ({ label, value }: { label: string; value: string }) => (
  <StatTile elevation={0}>
    <StatLabel>{label}</StatLabel>
    <StatValue>{value}</StatValue>
  </StatTile>
);

type PhotoTileProps = {
  photo: TrajectoryPhoto;
  active: boolean;
  placing: boolean;
  canEdit: boolean;
  onSelect: () => void;
  onStartPlacing?: () => void;
  onCancelPlacing?: () => void;
  onDelete?: () => void;
};

const PhotoTile = ({ photo, active, placing, canEdit, onSelect, onStartPlacing, onCancelPlacing, onDelete }: PhotoTileProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const place = photoPlace(photo);
  const unplaced = place === null;

  return (
    <Tile sx={{ border: active ? "2px solid var(--pin)" : "1px solid var(--rule)" }}>
      <PhotoButton aria-label={photoLabel(photo)} aria-pressed={active} disableRipple onClick={onSelect} type="button">
        <img alt="" loading="lazy" src={photo.thumbnailUrl} />
      </PhotoButton>
      {unplaced ? (
        <Chip sx={{ left: 8, top: 8 }}>位置情報なし</Chip>
      ) : (
        <>
          {active && <ActiveDot aria-hidden="true" />}
          <Chip sx={{ bottom: 8, left: 8 }}>{place}</Chip>
        </>
      )}
      {canEdit && unplaced && (
        <Pill
          disableRipple
          onClick={placing ? onCancelPlacing : onStartPlacing}
          type="button"
          sx={placing ? { background: "var(--pin)", "&:hover": { background: "var(--pin)" } } : undefined}
        >
          {placing ? "選択中…（取消）" : "置き場所を選ぶ"}
        </Pill>
      )}
      {canEdit && !unplaced && active && (
        <CornerButton
          aria-label="位置を置き直す"
          disableRipple
          onClick={placing ? onCancelPlacing : onStartPlacing}
          sx={{ left: 30, top: 8 }}
          type="button"
        >
          {placing ? "取消" : "移動"}
        </CornerButton>
      )}
      {canEdit && (
        <CornerButton
          aria-label={confirmingDelete ? "本当に削除する" : "写真を削除"}
          disableRipple
          onBlur={() => setConfirmingDelete(false)}
          onClick={() => {
            if (confirmingDelete) onDelete?.();
            else setConfirmingDelete(true);
          }}
          sx={{
            right: 8,
            top: 8,
            // The confirming state keeps its red background on hover (the plain hover is white).
            ...(confirmingDelete
              ? { background: "var(--pin)", color: "#fff", "&:hover": { background: "var(--pin)" } }
              : {}),
          }}
          type="button"
        >
          {confirmingDelete ? "削除?" : "✕"}
        </CornerButton>
      )}
    </Tile>
  );
};

type PhotoUploaderProps = {
  status: PhotoUploadStatus;
  onUploadFiles: (files: File[], timeZone: CameraTimeZone) => void;
};

const PhotoUploader = ({ status, onUploadFiles }: PhotoUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [timeZone, setTimeZone] = useState<CameraTimeZone>("JST");

  const submit = (list: FileList | null) => {
    const files = Array.from(list ?? []).filter((file) => file.type.startsWith("image/"));
    if (files.length > 0) onUploadFiles(files, timeZone);
  };

  return (
    <Stack spacing={1}>
      <DropZone
        aria-label="写真を追加"
        disabled={status.uploading}
        disableRipple
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          submit(event.dataTransfer.files);
        }}
        type="button"
      >
        <Typography component="span" sx={{ color: "var(--accent)", fontSize: 14, fontWeight: 700 }}>
          {status.uploading ? "アップロード中…" : "+ 写真を追加"}
        </Typography>
        <Typography component="span">クリックして選ぶか、ここにドラッグ＆ドロップ</Typography>
        <Typography component="span">
          撮影時刻か写真の位置情報（緯度経度）からルート上に置きます。どちらも無い写真は、置き場所を選んでください
        </Typography>
      </DropZone>
      <input
        accept="image/*"
        data-testid="photo-input"
        hidden
        multiple
        onChange={(event) => {
          submit(event.target.files);
          event.target.value = "";
        }}
        ref={inputRef}
        type="file"
      />
      <Stack alignItems="center" direction="row" spacing={1}>
        <Typography component="span" id="camera-time-zone-label" sx={{ color: "var(--ink-soft)", fontSize: 11, flex: 1 }}>
          カメラの時刻の設定（写真に時刻帯の情報があればそちらを優先）
        </Typography>
        <ToggleButtonGroup
          aria-labelledby="camera-time-zone-label"
          exclusive
          onChange={(_, next: CameraTimeZone | null) => next && setTimeZone(next)}
          size="small"
          value={timeZone}
        >
          {(["JST", "UTC"] as const).map((zone) => (
            <ToggleButton
              key={zone}
              sx={{ fontSize: 11, fontWeight: 700, padding: "2px 10px" }}
              value={zone}
            >
              {zone}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {status.failures.length > 0 && (
        <Stack role="alert" spacing={0.5} sx={{ color: "var(--pin)", fontSize: 12 }}>
          {status.failures.map((failure) => (
            <span key={`${failure.fileName}-${failure.reason}`}>
              {failure.fileName}: {failure.reason}
            </span>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

const NO_UPLOAD: PhotoUploadStatus = { uploading: false, failures: [] };

export const ImagePanel = ({
  activity,
  activePhotoId,
  here,
  onPhotoSelect,
  canEdit = false,
  placingPhotoId = null,
  uploadStatus = NO_UPLOAD,
  onUploadFiles,
  onStartPlacing,
  onCancelPlacing,
  onDeletePhoto,
}: ImagePanelProps) => {
  const hereElevation = Math.round(elevationAt(activity.elevation, here));
  const km = Math.trunc(activity.km / 1000);
  const hereKm = formatKmAt(km, here);
  // A photo without a position is a work in progress: only the admin sees it.
  const photos = canEdit ? activity.photos : activity.photos.filter((photo) => photo.at !== null);

  return (
    <PanelRoot spacing={2.5}>
      <StatGrid>
        <Stat label="この地点の標高" value={`${hereElevation}m`} />
        <Stat label="スタートから" value={`${hereKm} / ${formatKm(activity.km)}`} />
      </StatGrid>
      {photos.length > 0 && (
        <Box>
          <GridTitle direction="row" justifyContent="space-between">
            <Typography component="span">写真</Typography>
            <Typography component="span" sx={{ color: "var(--ink-soft)", fontWeight: 400 }}>
              {photos.length} 枚
            </Typography>
          </GridTitle>
          <PhotoGrid>
            {photos.map((photo) => (
              <PhotoTile
                active={photo.id === activePhotoId}
                canEdit={canEdit}
                key={photo.id}
                onCancelPlacing={onCancelPlacing}
                onDelete={() => onDeletePhoto?.(photo.id)}
                onSelect={() => onPhotoSelect(photo.id)}
                onStartPlacing={() => onStartPlacing?.(photo.id)}
                photo={photo}
                placing={photo.id === placingPhotoId}
              />
            ))}
          </PhotoGrid>
        </Box>
      )}
      {activity.note && activity.note !== "—" && <Note elevation={0}>"{activity.note}"</Note>}
      {canEdit && onUploadFiles && (
        <Box sx={{ marginTop: "auto !important", paddingTop: 2 }}>
          <PhotoUploader onUploadFiles={onUploadFiles} status={uploadStatus} />
        </Box>
      )}
    </PanelRoot>
  );
};
