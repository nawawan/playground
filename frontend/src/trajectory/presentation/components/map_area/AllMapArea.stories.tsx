import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AllMapArea } from "./AllMapArea";
import { trajectoryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectory/Components/AllMapArea",
  component: AllMapArea,
  decorators: [
    (Story) => (
      <Box sx={{ height: 520, width: "100%" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof AllMapArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mapStyle: "terrain",
    onViewportChange: () => undefined,
    tracks: trajectoryActivities.map(({ id, track }) => ({ id, track })),
  },
};
