import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectoryPage } from "./TrajectoryPage";
import { Header } from "../components/header/Header";
import { ImagePanel } from "../components/image_panel/ImagePanel";
import { AllMapArea } from "../components/map_area/AllMapArea";
import { MapArea } from "../components/map_area/MapArea";
import { TrajectoryDetail } from "../components/trajectory_detail/TrajectoryDetail";
import { TrajectoryHeight } from "../components/trajectory_height/TrajectoryHeight";
import { TrajectorySideBar } from "../components/trajectory_side_bar/TrajectorySideBar";
import { buildYearGroups } from "../../domain/entries";
import { listedActivities, mockTravels, trajectoryActivities as mockActivities } from "../../domain/mockData";
import { withPhotos } from "../../domain/photoPosition";
import { composeTravel, isTravelSelectionId, travelIdOfSelection, travelSelectionId } from "../../domain/travel";
import { ALL_ACTIVITY_ID } from "../../domain/types";
import { sampleActivities } from "./fixtures/sampleActivity";

const trajectoryActivities = [...sampleActivities, ...mockActivities];

// The design: years, a travel (戸隠) and standalone activities.
const allPhotos = listedActivities.flatMap((activity) => activity.photos);

const meta = {
  title: "Trajectory/Page",
  component: TrajectoryPage,
  parameters: {
    layout: "fullscreen",
  },
  // render で上書きしない story 用の既定値
  args: {
    status: "ready",
    viewMode: "single",
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
  const [activeId, setActiveId] = useState(listedActivities[0].id);
  const viewMode = isTravelSelectionId(activeId) ? "travel" : "single";
  const groups = buildYearGroups(listedActivities, mockTravels);
  const activity =
    viewMode === "travel"
      ? composeTravel(
          mockTravels.find((travel) => travel.id === travelIdOfSelection(activeId)) ?? mockTravels[0],
          listedActivities.filter((item) => item.travelId === travelIdOfSelection(activeId)).map((item) => withPhotos(item, allPhotos)),
        )
      : withPhotos(listedActivities.find((item) => item.id === activeId) ?? listedActivities[0], allPhotos);

  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [placingPhotoId, setPlacingPhotoId] = useState<string | null>(null);
  const [here, setHere] = useState(0.5);

  const select = (id: string) => {
    setActiveId(id);
    setActivePhotoId(null);
    setPlacingPhotoId(null);
    setHere(0.5);
  };

  const selectPhoto = (photoId: string) => {
    setActivePhotoId(photoId);
    const photo = activity.photos.find((item) => item.id === photoId);
    if (photo?.at != null) setHere(photo.at);
  };

  return (
    <TrajectoryPage
      status="ready"
      viewMode={viewMode}
      Header={<Header canUpload={canUpload} onUpload={() => undefined} />}
      ImagePanel={
        <ImagePanel
          activePhotoId={activePhotoId}
          activity={activity}
          canEdit={canUpload && viewMode === "single"}
          here={here}
          onCancelPlacing={() => setPlacingPhotoId(null)}
          onPhotoSelect={selectPhoto}
          onStartPlacing={setPlacingPhotoId}
          onUploadFiles={() => undefined}
          placingPhotoId={placingPhotoId}
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
      TrajectoryDetail={
        <TrajectoryDetail
          activity={activity}
          canEdit={canUpload && viewMode === "single"}
          endDate={viewMode === "travel" ? listedActivities[3].date : undefined}
          travels={mockTravels}
        />
      }
      TrajectoryHeight={
        <TrajectoryHeight
          activePhotoId={activePhotoId}
          activity={activity}
          here={here}
          onCancelPlacing={() => setPlacingPhotoId(null)}
          onHereChange={setHere}
          onPhotoSelect={selectPhoto}
          onPlacePhoto={() => setPlacingPhotoId(null)}
          placingPhotoId={placingPhotoId}
        />
      }
      TrajectorySideBar={
        <TrajectorySideBar
          activeId={activeId}
          canEdit={canUpload}
          groups={groups}
          onNewTravel={() => undefined}
          onSelectActivity={select}
          onSelectTravel={(travelId) => select(travelSelectionId(travelId))}
          onUpload={() => undefined}
          totalCount={listedActivities.length}
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

// All カード選択時: 地図のみ（高度グラフ・詳細・写真パネルは出さない）
export const AllView: Story = {
  render: () => (
    <TrajectoryPage
      status="ready"
      viewMode="all"
      Header={<Header canUpload={false} onUpload={() => undefined} />}
      ImagePanel={null}
      MapArea={
        <AllMapArea
          mapStyle="terrain"
          onViewportChange={() => undefined}
          tracks={trajectoryActivities.map(({ id, track }) => ({ id, track }))}
        />
      }
      TrajectoryDetail={null}
      TrajectoryHeight={null}
      TrajectorySideBar={
        <TrajectorySideBar
          activeId={ALL_ACTIVITY_ID}
          canEdit={false}
          groups={buildYearGroups(listedActivities, mockTravels)}
          onNewTravel={() => undefined}
          onSelectActivity={() => undefined}
          onSelectTravel={() => undefined}
          onUpload={() => undefined}
          totalCount={listedActivities.length}
        />
      }
      UploadModal={null}
    />
  ),
};
