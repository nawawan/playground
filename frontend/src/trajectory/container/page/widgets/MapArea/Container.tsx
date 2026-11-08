import { Box, Button, ButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMemo } from "react";
import { AllMapArea } from "../../../../presentation/components/map_area/AllMapArea";
import { MapArea } from "../../../../presentation/components/map_area/MapArea";
import { applyLodOverride } from "../../../../domain/lod";
import { useTrajectoryPageState } from "../../state/useTrajectoryPageState";
import { useViewportLod } from "./useViewportLod";
import type { MapStyleKey } from "../../../../domain/types";

const MapShell = styled(Box)({
  flex: 1,
  minHeight: 0,
  position: "relative",
});

const StyleSwitcher = styled(ButtonGroup)({
  background: "#fff",
  borderRadius: 999,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
  padding: 3,
  position: "absolute",
  right: 14,
  top: 14,
  zIndex: 10,
  "& button": {
    background: "transparent",
    border: 0,
    borderRadius: 999,
    color: "var(--ink)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    padding: "8px 16px",
  },
});

const MAP_STYLE_LABELS: Record<MapStyleKey, string> = {
  terrain: "地形",
  streets: "ストリート",
};

export const MapAreaContainer = () => {
  const { activities, activeActivity, activePhotoId, here, lodOverrides, mapStyle, viewMode, onMapStyleChange, onSelectPhoto } =
    useTrajectoryPageState();
  const { onViewportChange } = useViewportLod();
  const allTracks = useMemo(
    () => activities.map((activity) => applyLodOverride(activity, lodOverrides)),
    [activities, lodOverrides],
  );

  if (viewMode === "single" && !activeActivity) return null;

  return (
    <MapShell>
      <StyleSwitcher aria-label="map style" variant="text">
        {(["terrain", "streets"] as const).map((style) => (
          <Button
            disableRipple
            key={style}
            onClick={() => onMapStyleChange(style)}
            sx={
              style === mapStyle
                ? { background: "var(--accent)", color: "#fff" }
                : undefined
            }
            type="button"
          >
            {MAP_STYLE_LABELS[style]}
          </Button>
        ))}
      </StyleSwitcher>
      {viewMode === "all" ? (
        <AllMapArea mapStyle={mapStyle} onViewportChange={onViewportChange} tracks={allTracks} />
      ) : (
        activeActivity && (
          <MapArea
            activePhotoId={activePhotoId}
            activity={activeActivity}
            here={here}
            mapStyle={mapStyle}
            onPhotoSelect={onSelectPhoto}
            onViewportChange={onViewportChange}
          />
        )
      )}
    </MapShell>
  );
};
