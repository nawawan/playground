import { useState } from "react";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImagePanel } from "./ImagePanel";
import { trajectryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectry/Components/ImagePanel",
  component: ImagePanel,
  decorators: [
    (Story) => (
      <Box sx={{ background: "#faf7f1", height: 720, maxWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ImagePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveImagePanel = () => {
  const activity = trajectryActivities[1];
  const [activePhotoId, setActivePhotoId] = useState(activity.photos[0]?.id ?? null);
  const activePhoto = activity.photos.find((photo) => photo.id === activePhotoId);

  return (
    <ImagePanel
      activePhotoId={activePhotoId}
      activity={activity}
      here={activePhoto?.at ?? 0.52}
      onPhotoSelect={setActivePhotoId}
    />
  );
};

export const Default: Story = {
  args: {
    activePhotoId: trajectryActivities[1].photos[0]?.id ?? null,
    activity: trajectryActivities[1],
    here: trajectryActivities[1].photos[0]?.at ?? 0.52,
    onPhotoSelect: () => undefined,
  },
  render: () => <InteractiveImagePanel />,
};
