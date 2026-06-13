import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectryDetail } from "./TrajectryDetail";
import { trajectryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectry/Components/TrajectryDetail",
  component: TrajectryDetail,
  decorators: [
    (Story) => (
      <Box sx={{ background: "#faf7f1", maxWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof TrajectryDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activity: trajectryActivities[1],
  },
};
