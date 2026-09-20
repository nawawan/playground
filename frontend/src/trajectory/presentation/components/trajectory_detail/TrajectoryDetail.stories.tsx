import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectoryDetail } from "./TrajectoryDetail";
import { trajectoryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectory/Components/TrajectoryDetail",
  component: TrajectoryDetail,
  decorators: [
    (Story) => (
      <Box sx={{ background: "#faf7f1", maxWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof TrajectoryDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activity: trajectoryActivities[1],
  },
};
