import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrajectryPage } from "./TrajectryPage";
import { HeaderContainer } from "../../container/page/widgets/Header/Container";
import { ImagePanelContainer } from "../../container/page/widgets/ImagePanel/Container";
import { MapAreaContainer } from "../../container/page/widgets/MapArea/Container";
import { TrajectryDetailContainer } from "../../container/page/widgets/TrajectryDetail/Container";
import { TrajectryHeightContainer } from "../../container/page/widgets/TrajectryHeight/Container";
import { TrajectryPageStateProvider } from "../../container/page/state/TrajectryPageStateProvider";
import { TrajectrySideBarContainer } from "../../container/page/widgets/TrajectrySideBar/Container";
import { UploadModalContainer } from "../../container/page/widgets/UploadModal/Container";

const meta = {
  title: "Trajectry/Page",
  component: TrajectryPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TrajectryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTrajectryPage = () => (
  <TrajectryPageStateProvider>
    <TrajectryPage
      Header={<HeaderContainer />}
      ImagePanel={<ImagePanelContainer />}
      MapArea={<MapAreaContainer />}
      TrajectryDetail={<TrajectryDetailContainer />}
      TrajectryHeight={<TrajectryHeightContainer />}
      TrajectrySideBar={<TrajectrySideBarContainer />}
      UploadModal={<UploadModalContainer />}
    />
  </TrajectryPageStateProvider>
);

export const Default: Story = {
  args: {
    Header: <HeaderContainer />,
    ImagePanel: <ImagePanelContainer />,
    MapArea: <MapAreaContainer />,
    TrajectryDetail: <TrajectryDetailContainer />,
    TrajectryHeight: <TrajectryHeightContainer />,
    TrajectrySideBar: <TrajectrySideBarContainer />,
    UploadModal: <UploadModalContainer />,
  },
  render: () => <InteractiveTrajectryPage />,
};
