import { useState } from "react";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapArea } from "./MapArea";
import { trajectryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectry/Components/MapArea",
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
  const activity = trajectryActivities[0];
  const [activePhotoId, setActivePhotoId] = useState(activity.photos[2]?.id ?? null);
  const activePhoto = activity.photos.find((photo) => photo.id === activePhotoId);

  return (
    <MapArea
      activePhotoId={activePhotoId}
      activity={activity}
      here={activePhoto?.at ?? 0.52}
      mapStyle="sepia"
      onPhotoSelect={setActivePhotoId}
    />
  );
};

export const Default: Story = {
  args: {
    activePhotoId: trajectryActivities[0].photos[2]?.id ?? null,
    activity: trajectryActivities[0],
    here: trajectryActivities[0].photos[2]?.at ?? 0.52,
    mapStyle: "sepia",
    onPhotoSelect: () => undefined,
  },
  render: () => <InteractiveMapArea />,
};
