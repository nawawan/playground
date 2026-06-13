import { Box, Button, ButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MapArea } from "../../../../presentation/components/map_area/MapArea";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

const MapShell = styled(Box)({
  flex: 1,
  minHeight: 0,
  position: "relative",
});

const StyleSwitcher = styled(ButtonGroup)({
  background: "rgba(250, 247, 241, 0.88)",
  border: "1px solid var(--rule)",
  borderRadius: 999,
  boxShadow: "0 2px 8px rgba(42, 38, 34, 0.08)",
  padding: 3,
  position: "absolute",
  right: 14,
  top: 14,
  zIndex: 10,
  "& button": {
    background: "transparent",
    border: 0,
    borderRadius: 999,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10,
    padding: "6px 9px",
  },
  "& button.is-active": {
    background: "var(--trace)",
    color: "#fff",
  },
});

export const MapAreaContainer = () => {
  const { activeActivity, activePhotoId, here, mapStyle, onMapStyleChange, onSelectPhoto } = useTrajectryPageState();

  return (
    <MapShell>
      <StyleSwitcher aria-label="map style" variant="text">
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
      </StyleSwitcher>
      <MapArea
        activePhotoId={activePhotoId}
        activity={activeActivity}
        here={here}
        mapStyle={mapStyle}
        onPhotoSelect={onSelectPhoto}
      />
    </MapShell>
  );
};
