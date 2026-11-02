import { useState } from "react";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectorySideBar } from "./TrajectorySideBar";
import { trajectoryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectory/Components/TrajectorySideBar",
  component: TrajectorySideBar,
  decorators: [
    (Story) => (
      <Box sx={{ height: 720 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof TrajectorySideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveSideBar = () => {
  const [activeId, setActiveId] = useState(trajectoryActivities[0].id);

  return (
    <TrajectorySideBar
      activeId={activeId}
      activities={trajectoryActivities}
      canUpload
      onSelectActivity={setActiveId}
      onUpload={() => undefined}
    />
  );
};

export const Default: Story = {
  args: {
    activeId: trajectoryActivities[0].id,
    activities: trajectoryActivities,
    canUpload: true,
    onSelectActivity: () => undefined,
    onUpload: () => undefined,
  },
  render: () => <InteractiveSideBar />,
};
