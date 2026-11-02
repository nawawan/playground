import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityCard } from "./ActivityCard";
import { trajectoryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectory/Components/ActivityCard",
  component: ActivityCard,
} satisfies Meta<typeof ActivityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activity: trajectoryActivities[1],
    active: false,
    onSelect: () => undefined,
  },
};

export const Active: Story = {
  args: {
    activity: trajectoryActivities[0],
    active: true,
    onSelect: () => undefined,
  },
};
