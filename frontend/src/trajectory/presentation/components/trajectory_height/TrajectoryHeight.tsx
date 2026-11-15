import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { photoLabel } from "../../../domain/format";
import { clamp, elevationAt, formatKmAt } from "../../../domain/geo";
import type { TrajectoryActivity } from "../../../domain/types";

type TrajectoryHeightProps = {
  activity: TrajectoryActivity;
  activePhotoId: string | null;
  here: number;
  onHereChange: (here: number) => void;
  onPhotoSelect: (photoId: string) => void;
  // While set, clicking the chart puts that photo there instead of moving the cursor.
  placingPhotoId?: string | null;
  // `at`: where on the chart (0..1) was clicked.
  onPlacePhoto?: (at: number) => void;
  onCancelPlacing?: () => void;
};

const SVG_WIDTH = 100;
const SVG_HEIGHT = 30;
const PADDING = 2;

const HeightRoot = styled(Stack)({
  background: "var(--paper)",
  borderTop: "1px solid var(--rule)",
  flexShrink: 0,
  padding: "10px 14px 12px",
});

const HeaderRow = styled(Stack)({
  alignItems: "flex-start",
  justifyContent: "space-between",
});

const Label = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 12,
});

const StatGroup = styled(Stack)({
  alignItems: "flex-end",
});

const StatCaption = styled(Typography)({
  color: "var(--ink-soft)",
  fontSize: 11,
});

const PlacingBanner = styled(Stack)({
  alignItems: "center",
  background: "var(--ink)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
  gap: 10,
  justifyContent: "space-between",
  padding: "6px 10px",
});

const StatNumber = styled(Typography)({
  color: "var(--ink)",
  fontSize: 13,
  fontWeight: 700,
});

export const TrajectoryHeight = ({
  activity,
  activePhotoId,
  here,
  onHereChange,
  onPhotoSelect,
  placingPhotoId = null,
  onPlacePhoto,
  onCancelPlacing,
}: TrajectoryHeightProps) => {
  const placing = placingPhotoId !== null;
  const hasElevation = activity.elevation.length > 0;
  const minElevation = hasElevation ? Math.min(...activity.elevation) : 0;
  const maxElevation = hasElevation ? Math.max(...activity.elevation) : 0;
  const points = activity.elevation.map((elevation, index) => {
    const x = (index / Math.max(activity.elevation.length - 1, 1)) * SVG_WIDTH;
    const y =
      SVG_HEIGHT -
      PADDING -
      ((elevation - minElevation) / (maxElevation - minElevation || 1)) * (SVG_HEIGHT - PADDING * 2);
    return [x, y] as const;
  });
  const linePath = `M ${points.map(([x, y]) => `${x},${y}`).join(" L ")}`;
  const fillPath = `${linePath} L ${SVG_WIDTH},${SVG_HEIGHT} L 0,${SVG_HEIGHT} Z`;
  const hereElevation = Math.round(elevationAt(activity.elevation, here));
  const km = Math.trunc(activity.km / 1000);
  const hereKm = formatKmAt(km, here);

  const atOf = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return clamp((event.clientX - rect.left) / rect.width);
  };

  const scrub = (event: React.PointerEvent<HTMLDivElement>) => onHereChange(atOf(event));

  const press = (event: React.PointerEvent<HTMLDivElement>) => {
    if (placing) onPlacePhoto?.(atOf(event));
    else scrub(event);
  };

  return (
    <HeightRoot spacing={0.75}>
      <HeaderRow direction="row">
        <Label>ELEVATION PROFILE · drag or hover to scrub</Label>
        <Stack direction="row" spacing={2.5}>
          <StatGroup>
            <StatNumber>{minElevation}m</StatNumber>
          </StatGroup>
          <StatGroup>
            <StatCaption>max</StatCaption>
            <StatNumber>{Math.round(maxElevation)}m</StatNumber>
          </StatGroup>
          <StatGroup>
            <StatNumber>{km}</StatNumber>
            <StatCaption>km</StatCaption>
          </StatGroup>
        </Stack>
      </HeaderRow>
      {placing && (
        <PlacingBanner direction="row">
          <span>写真を置く位置をクリックしてください</span>
          <Button
            disableRipple
            onClick={onCancelPlacing}
            sx={{ color: "#fff", fontSize: 12, padding: "0 6px", textDecoration: "underline" }}
            type="button"
          >
            キャンセル
          </Button>
        </PlacingBanner>
      )}
      <Box
        aria-label={placing ? "elevation chart (choose a photo position)" : "elevation chart"}
        onPointerDown={press}
        onPointerMove={scrub}
        role="application"
        sx={{
          cursor: "crosshair",
          height: 92,
          position: "relative",
          userSelect: "none",
          "& svg": { height: "100%", inset: 0, position: "absolute", width: "100%" },
        }}
      >
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`elevation-fill-${activity.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="red" stopOpacity="0.35" />
              <stop offset="100%" stopColor="red" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((grid) => (
            <line
              key={grid}
              stroke="rgba(0, 0, 0, 0.06)"
              strokeWidth="0.2"
              vectorEffect="non-scaling-stroke"
              x1="0"
              x2={SVG_WIDTH}
              y1={SVG_HEIGHT * grid}
              y2={SVG_HEIGHT * grid}
            />
          ))}
          {hasElevation && (
            <>
              <path d={fillPath} fill={`url(#elevation-fill-${activity.id})`} />
              <path
                d={linePath}
                fill="none"
                stroke="red"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
        {/* A photo that is not placed yet has no position on the chart. */}
        {activity.photos.map((photo) =>
          photo.at === null ? null : (
            <span className="trajectory-height__photo-wrap" key={photo.id} style={{ left: `${photo.at * 100}%` }}>
              <Button
                aria-label={photoLabel(photo)}
                className={`trajectory-height__photo${activePhotoId === photo.id ? " is-active" : ""}`}
                disableRipple
                onClick={(event) => {
                  event.stopPropagation();
                  onPhotoSelect(photo.id);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              />
              <span aria-hidden="true" className="trajectory-height__photo-preview">
                <img alt="" src={photo.thumbnailUrl} />
              </span>
            </span>
          ),
        )}
        <Box
          style={{ left: `${here * 100}%` }}
          sx={{ borderLeft: "1.5px solid var(--pin)", bottom: 0, pointerEvents: "none", position: "absolute", top: 0 }}
        />
        <Typography
          component="div"
          style={{ left: `${here * 100}%` }}
          sx={{
            background: "var(--paper)",
            border: "1px solid var(--rule)",
            borderRadius: "6px",
            color: "var(--ink)",
            fontSize: 11,
            padding: "3px 8px",
            pointerEvents: "none",
            position: "absolute",
            top: -2,
            transform: "translateX(8px)",
            whiteSpace: "nowrap",
            zIndex: 3,
          }}
        >
          {hereElevation}m · {hereKm}km
        </Typography>
      </Box>
    </HeightRoot>
  );
};
