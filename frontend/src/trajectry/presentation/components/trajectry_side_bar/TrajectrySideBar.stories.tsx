import { useState } from "react";
import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectrySideBar } from "./TrajectrySideBar";
import { trajectryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectry/Components/TrajectrySideBar",
  component: TrajectrySideBar,
  decorators: [
    (Story) => (
      <Box sx={{ height: 720 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof TrajectrySideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveSideBar = () => {
  const [activeId, setActiveId] = useState(trajectryActivities[0].id);

  return (
    <TrajectrySideBar
      activeId={activeId}
      activities={trajectryActivities}
      onSelectActivity={setActiveId}
      onUpload={() => undefined}
    />
  );
};

export const Default: Story = {
  args: {
    activeId: trajectryActivities[0].id,
    activities: trajectryActivities,
    onSelectActivity: () => undefined,
    onUpload: () => undefined,
  },
  render: () => <InteractiveSideBar />,
};
