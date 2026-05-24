import { Box, Button, Stack, Typography } from "@mui/material";
import { clamp, elevationAt, formatKmAt } from "../../../domain/geo";
import type { TrajectryActivity } from "../../../domain/types";

type TrajectryHeightProps = {
  activity: TrajectryActivity;
  activePhotoId: string | null;
  here: number;
  onHereChange: (here: number) => void;
  onPhotoSelect: (photoId: string) => void;
};

const SVG_WIDTH = 100;
const SVG_HEIGHT = 30;
const PADDING = 2;

export const TrajectryHeight = ({
  activity,
  activePhotoId,
  here,
  onHereChange,
  onPhotoSelect,
}: TrajectryHeightProps) => {
  const minElevation = Math.min(...activity.elevation);
  const maxElevation = Math.max(...activity.elevation);
  const points = activity.elevation.map((elevation, index) => {
    const x = (index / (activity.elevation.length - 1)) * SVG_WIDTH;
    const y =
      SVG_HEIGHT -
      PADDING -
      ((elevation - minElevation) / (maxElevation - minElevation || 1)) * (SVG_HEIGHT - PADDING * 2);
    return [x, y] as const;
  });
  const linePath = `M ${points.map(([x, y]) => `${x},${y}`).join(" L ")}`;
  const fillPath = `${linePath} L ${SVG_WIDTH},${SVG_HEIGHT} L 0,${SVG_HEIGHT} Z`;
  const hereElevation = Math.round(elevationAt(activity.elevation, here));
  const hereKm = formatKmAt(activity.km, here);

  const scrub = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onHereChange(clamp((event.clientX - rect.left) / rect.width));
  };

  return (
    <Stack className="trajectry-height" component="section" spacing={0.75}>
      <Stack alignItems="baseline" className="trajectry-height__head" direction="row" justifyContent="space-between">
        <Typography className="trajectry-mono trajectry-height__label" component="div">
          ELEVATION PROFILE · drag or hover to scrub
        </Typography>
        <Stack className="trajectry-mono trajectry-height__stats" direction="row" spacing={1.75}>
          <Typography component="span">{minElevation}m</Typography>
          <Typography component="span">↑ {Math.round(maxElevation)}m</Typography>
          <Typography component="span">{activity.km} km</Typography>
        </Stack>
      </Stack>
      <Box className="trajectry-height__chart" onPointerDown={scrub} onPointerMove={scrub}>
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`elevation-fill-${activity.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={activity.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={activity.color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((grid) => (
            <line
              key={grid}
              stroke="rgba(42,38,34,0.06)"
              strokeWidth="0.2"
              vectorEffect="non-scaling-stroke"
              x1="0"
              x2={SVG_WIDTH}
              y1={SVG_HEIGHT * grid}
              y2={SVG_HEIGHT * grid}
            />
          ))}
          <path d={fillPath} fill={`url(#elevation-fill-${activity.id})`} />
          <path
            d={linePath}
            fill="none"
            stroke={activity.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {activity.photos.map((photo) => (
          <Button
            aria-label={photo.caption}
            className={`trajectry-height__photo${activePhotoId === photo.id ? " is-active" : ""}`}
            disableRipple
            key={photo.id}
            onClick={(event) => {
              event.stopPropagation();
              onPhotoSelect(photo.id);
            }}
            style={{ left: `${photo.at * 100}%` }}
            type="button"
          />
        ))}
        <Box className="trajectry-height__here-line" style={{ left: `${here * 100}%` }} />
        <Typography className="trajectry-mono trajectry-height__tooltip" component="div" style={{ left: `${here * 100}%` }}>
          {hereElevation}m · {hereKm}km
        </Typography>
      </Box>
    </Stack>
  );
};
