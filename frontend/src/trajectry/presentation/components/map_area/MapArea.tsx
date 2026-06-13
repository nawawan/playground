import { Box, Typography } from "@mui/material";
import { pointAt } from "../../../domain/geo";
import type { MapStyleKey, TrajectryActivity } from "../../../domain/types";
import { ImageIcon } from "../image_icon/ImageIcon";

type MapAreaProps = {
  activity: TrajectryActivity;
  activePhotoId: string | null;
  here: number;
  mapStyle: MapStyleKey;
  onPhotoSelect: (photoId: string) => void;
};

const projectTrack = (activity: TrajectryActivity) => {
  const lngs = activity.track.map(([lng]) => lng);
  const lats = activity.track.map(([, lat]) => lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const width = maxLng - minLng || 1;
  const height = maxLat - minLat || 1;

  return (point: [number, number]) => {
    const x = 8 + ((point[0] - minLng) / width) * 84;
    const y = 8 + (1 - (point[1] - minLat) / height) * 84;
    return { x, y };
  };
};

const pathFromPoints = (points: { x: number; y: number }[]) =>
  points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");

export const MapArea = ({ activity, activePhotoId, here, mapStyle, onPhotoSelect }: MapAreaProps) => {
  const project = projectTrack(activity);
  const points = activity.track.map(project);
  const herePoint = project(pointAt(activity.track, here));
  const start = points[0];
  const end = points[points.length - 1];

  return (
    <Box className={`trajectry-map-area trajectry-map-area--${mapStyle}`} component="section" aria-label="route map">
      <Box className="trajectry-map-area__texture" />
      <svg className="trajectry-map-area__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id={`grid-${activity.id}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(42,38,34,0.08)" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${activity.id})`} />
        <path d="M 4 72 C 20 60 26 68 38 55 S 60 32 78 45 S 86 70 96 61" className="trajectry-map-area__river" />
        <path d="M 10 24 C 26 30 40 25 54 18 S 78 12 92 20" className="trajectry-map-area__road" />
        <path d="M 8 84 C 24 72 36 78 52 66 S 76 54 92 60" className="trajectry-map-area__road" />
        <path d={pathFromPoints(points)} className="trajectry-map-area__track-glow" stroke={activity.color} />
        <path d={pathFromPoints(points)} className="trajectry-map-area__track" stroke={activity.color} />
      </svg>
      <Box className="trajectry-map-area__labels">
        <Typography component="span" style={{ left: "12%", top: "16%" }}>
          {activity.title}
        </Typography>
        <Typography component="span" style={{ right: "11%", bottom: "18%" }}>
          {activity.subtitle}
        </Typography>
      </Box>
      <Box
        className="trajectry-map-area__marker trajectry-map-area__marker--start"
        component="span"
        style={{ left: `${start.x}%`, top: `${start.y}%` }}
      />
      <Box
        className="trajectry-map-area__marker trajectry-map-area__marker--end"
        component="span"
        style={{ left: `${end.x}%`, top: `${end.y}%` }}
      />
      {activity.photos.map((photo) => {
        const position = project(pointAt(activity.track, photo.at));
        return (
          <ImageIcon
            active={photo.id === activePhotoId}
            key={photo.id}
            label={photo.caption}
            onClick={() => onPhotoSelect(photo.id)}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          />
        );
      })}
      <Box className="trajectry-map-area__here" component="span" style={{ left: `${herePoint.x}%`, top: `${herePoint.y}%` }} />
      <Typography className="trajectry-mono trajectry-map-area__attribution" component="div">
        mock route layer · presentational map area
      </Typography>
    </Box>
  );
};
