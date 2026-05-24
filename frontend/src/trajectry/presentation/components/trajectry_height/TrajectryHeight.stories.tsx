import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectryHeight } from "./TrajectryHeight";
import { trajectryActivities } from "../../../domain/mockData";

const meta = {
  title: "Trajectry/Components/TrajectryHeight",
  component: TrajectryHeight,
} satisfies Meta<typeof TrajectryHeight>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTrajectryHeight = () => {
  const activity = trajectryActivities[0];
  const [here, setHere] = useState(activity.photos[2]?.at ?? 0.5);
  const [activePhotoId, setActivePhotoId] = useState(activity.photos[2]?.id ?? null);

  const selectPhoto = (photoId: string) => {
    const photo = activity.photos.find((item) => item.id === photoId);
    setActivePhotoId(photoId);
    if (photo) setHere(photo.at);
  };

  return (
    <TrajectryHeight
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
    activePhotoId: trajectryActivities[0].photos[2]?.id ?? null,
    activity: trajectryActivities[0],
    here: trajectryActivities[0].photos[2]?.at ?? 0.5,
    onHereChange: () => undefined,
    onPhotoSelect: () => undefined,
  },
  render: () => <InteractiveTrajectryHeight />,
};
