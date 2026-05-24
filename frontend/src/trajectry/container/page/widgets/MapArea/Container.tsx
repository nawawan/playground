import { Box, Button, ButtonGroup } from "@mui/material";
import { MapArea } from "../../../../presentation/components/map_area/MapArea";
import { useTrajectryPageState } from "../../state/useTrajectryPageState";

export const MapAreaContainer = () => {
  const { activeActivity, activePhotoId, here, mapStyle, onMapStyleChange, onSelectPhoto } = useTrajectryPageState();

  return (
    <Box className="trajectry-page__map-shell">
      <ButtonGroup className="trajectry-style-switcher" aria-label="map style" variant="text">
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
      </ButtonGroup>
      <MapArea
        activePhotoId={activePhotoId}
        activity={activeActivity}
        here={here}
        mapStyle={mapStyle}
        onPhotoSelect={onSelectPhoto}
      />
    </Box>
  );
};
