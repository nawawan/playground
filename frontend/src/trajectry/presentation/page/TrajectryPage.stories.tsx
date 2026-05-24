import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectryPage } from "./TrajectryPage";
import { trajectryActivities } from "../../domain/mockData";
import type { MapStyleKey } from "../../domain/types";

const meta = {
  title: "Trajectry/Page",
  component: TrajectryPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TrajectryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTrajectryPage = () => {
  const [activeId, setActiveId] = useState(trajectryActivities[1].id);
  const activeActivity = trajectryActivities.find((activity) => activity.id === activeId) ?? trajectryActivities[0];
  const [activePhotoId, setActivePhotoId] = useState(activeActivity.photos[0]?.id ?? null);
  const [here, setHere] = useState(activeActivity.photos[0]?.at ?? 0.5);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("sepia");
  const [uploadOpen, setUploadOpen] = useState(false);

  const selectActivity = (activityId: string) => {
    const nextActivity = trajectryActivities.find((activity) => activity.id === activityId);
    if (!nextActivity) return;
    const nextPhoto = nextActivity.photos[0] ?? null;
    setActiveId(activityId);
    setActivePhotoId(nextPhoto?.id ?? null);
    setHere(nextPhoto?.at ?? 0.5);
  };

  const selectPhoto = (photoId: string) => {
    const nextPhoto = activeActivity.photos.find((photo) => photo.id === photoId);
    setActivePhotoId(photoId);
    if (nextPhoto) setHere(nextPhoto.at);
  };

  return (
    <TrajectryPage
      activeActivity={activeActivity}
      activeId={activeId}
      activePhotoId={activePhotoId}
      activities={trajectryActivities}
      here={here}
      mapStyle={mapStyle}
      onCloseUpload={() => setUploadOpen(false)}
      onHereChange={setHere}
      onMapStyleChange={setMapStyle}
      onOpenUpload={() => setUploadOpen(true)}
      onSelectActivity={selectActivity}
      onSelectPhoto={selectPhoto}
      uploadOpen={uploadOpen}
    />
  );
};

export const Default: Story = {
  args: {
    activeActivity: trajectryActivities[1],
    activeId: trajectryActivities[1].id,
    activePhotoId: trajectryActivities[1].photos[0]?.id ?? null,
    activities: trajectryActivities,
    here: trajectryActivities[1].photos[0]?.at ?? 0.5,
    mapStyle: "sepia",
    onCloseUpload: () => undefined,
    onHereChange: () => undefined,
    onMapStyleChange: () => undefined,
    onOpenUpload: () => undefined,
    onSelectActivity: () => undefined,
    onSelectPhoto: () => undefined,
    uploadOpen: false,
  },
  render: () => <InteractiveTrajectryPage />,
};
