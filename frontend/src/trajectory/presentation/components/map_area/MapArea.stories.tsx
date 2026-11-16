import { useState } from "react";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapArea } from "./MapArea";
import { trajectoryActivities } from "../../../domain/mockData";
import "../../page/TrajectoryPage.css";

const meta = {
  title: "Trajectory/Components/MapArea",
  component: MapArea,
  decorators: [
    (Story) => (
      <Box sx={{ height: 520, width: "100%" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof MapArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveMapArea = () => {
  const activity = trajectoryActivities[0];
  const [activePhotoId, setActivePhotoId] = useState(activity.photos[2]?.id ?? null);
  const activePhoto = activity.photos.find((photo) => photo.id === activePhotoId);

  return (
    <MapArea
      activePhotoId={activePhotoId}
      activity={activity}
      here={activePhoto?.at ?? 0.52}
      mapStyle="terrain"
      onPhotoSelect={setActivePhotoId}
    />
  );
};

export const Default: Story = {
  args: {
    activePhotoId: trajectoryActivities[0].photos[2]?.id ?? null,
    activity: trajectoryActivities[0],
    here: trajectoryActivities[0].photos[2]?.at ?? 0.52,
    mapStyle: "terrain",
    onPhotoSelect: () => undefined,
  },
  render: () => <InteractiveMapArea />,
};

// Switching the style must keep the track. The map is a canvas, so this one is checked by eye.
const StyleSwitchMapArea = () => {
  const activity = trajectoryActivities[0];
  const [mapStyle, setMapStyle] = useState<"terrain" | "streets">("terrain");

  return (
    <>
      <button onClick={() => setMapStyle((current) => (current === "terrain" ? "streets" : "terrain"))} type="button">
        switch style ({mapStyle})
      </button>
      <Box sx={{ height: 480 }}>
        <MapArea
          activePhotoId={null}
          activity={activity}
          here={0.5}
          mapStyle={mapStyle}
          onPhotoSelect={() => undefined}
        />
      </Box>
    </>
  );
};

export const StyleSwitch: Story = {
  args: {
    activePhotoId: null,
    activity: trajectoryActivities[0],
    here: 0.5,
    mapStyle: "terrain",
    onPhotoSelect: () => undefined,
  },
  render: () => <StyleSwitchMapArea />,
};
