import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectoryPage } from "./TrajectoryPage";
import { HeaderContainer } from "../../container/page/widgets/Header/Container";
import { ImagePanelContainer } from "../../container/page/widgets/ImagePanel/Container";
import { MapAreaContainer } from "../../container/page/widgets/MapArea/Container";
import { TrajectoryDetailContainer } from "../../container/page/widgets/TrajectoryDetail/Container";
import { TrajectoryHeightContainer } from "../../container/page/widgets/TrajectoryHeight/Container";
import { TrajectoryPageStateProvider } from "../../container/page/state/TrajectoryPageStateProvider";
import { TrajectorySideBarContainer } from "../../container/page/widgets/TrajectorySideBar/Container";
import { UploadModalContainer } from "../../container/page/widgets/UploadModal/Container";

const meta = {
  title: "Trajectory/Page",
  component: TrajectoryPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TrajectoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTrajectoryPage = () => (
  <TrajectoryPageStateProvider>
    <TrajectoryPage
      Header={<HeaderContainer canUpload />}
      ImagePanel={<ImagePanelContainer />}
      MapArea={<MapAreaContainer />}
      TrajectoryDetail={<TrajectoryDetailContainer />}
      TrajectoryHeight={<TrajectoryHeightContainer />}
      TrajectorySideBar={<TrajectorySideBarContainer canUpload={true} />}
      UploadModal={<UploadModalContainer />}
      status="ready"
    />
  </TrajectoryPageStateProvider>
);

export const Default: Story = {
  args: {
    Header: <HeaderContainer canUpload />,
    ImagePanel: <ImagePanelContainer />,
    MapArea: <MapAreaContainer />,
    TrajectoryDetail: <TrajectoryDetailContainer />,
    TrajectoryHeight: <TrajectoryHeightContainer />,
    TrajectorySideBar: <TrajectorySideBarContainer canUpload={true} />,
    UploadModal: <UploadModalContainer />,
    status: "ready",
  },
  render: () => <InteractiveTrajectoryPage />,
};
