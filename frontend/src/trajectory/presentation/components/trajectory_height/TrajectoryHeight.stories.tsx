import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectoryHeight } from "./TrajectoryHeight";
import { trajectoryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectory/Components/TrajectoryHeight",
  component: TrajectoryHeight,
} satisfies Meta<typeof TrajectoryHeight>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTrajectoryHeight = () => {
  const activity = trajectoryActivities[0];
  const [here, setHere] = useState(activity.photos[2]?.at ?? 0.5);
  const [activePhotoId, setActivePhotoId] = useState(activity.photos[2]?.id ?? null);

  const selectPhoto = (photoId: string) => {
    const photo = activity.photos.find((item) => item.id === photoId);
    setActivePhotoId(photoId);
    if (photo) setHere(photo.at);
  };

  return (
    <TrajectoryHeight
      activePhotoId={activePhotoId}
      activity={activity}
      here={here}
      onHereChange={setHere}
      onPhotoSelect={selectPhoto}
    />
  );
};

export const Default: Story = {
  args: {
    activePhotoId: trajectoryActivities[0].photos[2]?.id ?? null,
    activity: trajectoryActivities[0],
    here: trajectoryActivities[0].photos[2]?.at ?? 0.5,
    onHereChange: () => undefined,
    onPhotoSelect: () => undefined,
  },
  render: () => <InteractiveTrajectoryHeight />,
};
