import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectoryPage } from "./TrajectoryPage";
import { Header } from "../components/header/Header";
import { ImagePanel } from "../components/image_panel/ImagePanel";
import { MapArea } from "../components/map_area/MapArea";
import { TrajectoryDetail } from "../components/trajectory_detail/TrajectoryDetail";
import { TrajectoryHeight } from "../components/trajectory_height/TrajectoryHeight";
import { TrajectorySideBar } from "../components/trajectory_side_bar/TrajectorySideBar";
import { trajectoryActivities as mockActivities } from "../../domain/mockData";
import { sampleActivities } from "./fixtures/sampleActivity";

const trajectoryActivities = [...sampleActivities, ...mockActivities];

const meta = {
  title: "Trajectory/Page",
  component: TrajectoryPage,
  parameters: {
    layout: "fullscreen",
  },
  // render で上書きしない story 用の既定値
  args: {
    status: "ready",
    Header: null,
    ImagePanel: null,
    MapArea: null,
    TrajectoryDetail: null,
    TrajectoryHeight: null,
    TrajectorySideBar: null,
    UploadModal: null,
  },
} satisfies Meta<typeof TrajectoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// mockData を使い、本番 Container と同じ構成で各部品をつなぐ
const MockedTrajectoryPage = ({ canUpload }: { canUpload: boolean }) => {
  const [activeId, setActiveId] = useState(trajectoryActivities[0].id);
  const activity =
    trajectoryActivities.find((item) => item.id === activeId) ??
    trajectoryActivities[0];

  const [activePhotoId, setActivePhotoId] = useState<string | null>(
    activity.photos[0]?.id ?? null,
  );
  const [here, setHere] = useState(activity.photos[0]?.at ?? 0);

  const selectActivity = (id: string) => {
    const next = trajectoryActivities.find((item) => item.id === id);
    setActiveId(id);
    setActivePhotoId(next?.photos[0]?.id ?? null);
    setHere(next?.photos[0]?.at ?? 0);
  };

  const selectPhoto = (photoId: string) => {
    setActivePhotoId(photoId);
    const photo = activity.photos.find((item) => item.id === photoId);
    if (photo) setHere(photo.at);
  };

  return (
    <TrajectoryPage
      status="ready"
      Header={<Header canUpload={canUpload} onUpload={() => undefined} />}
      ImagePanel={
        <ImagePanel
          activePhotoId={activePhotoId}
          activity={activity}
          here={here}
          onPhotoSelect={selectPhoto}
        />
      }
      MapArea={
        <MapArea
          activePhotoId={activePhotoId}
          activity={activity}
          here={here}
          mapStyle="terrain"
          onPhotoSelect={selectPhoto}
        />
      }
      TrajectoryDetail={<TrajectoryDetail activity={activity} />}
      TrajectoryHeight={
        <TrajectoryHeight
          activePhotoId={activePhotoId}
          activity={activity}
          here={here}
          onHereChange={setHere}
          onPhotoSelect={selectPhoto}
        />
      }
      TrajectorySideBar={
        <TrajectorySideBar
          activeId={activeId}
          activities={trajectoryActivities}
          canUpload={canUpload}
          onSelectActivity={selectActivity}
          onUpload={() => undefined}
        />
      }
      UploadModal={null}
    />
  );
};

export const Default: Story = {
  render: () => <MockedTrajectoryPage canUpload />,
};

export const ViewOnly: Story = {
  render: () => <MockedTrajectoryPage canUpload={false} />,
};

export const Loading: Story = {
  args: { status: "loading" },
};

export const Empty: Story = {
  args: { status: "empty" },
};
