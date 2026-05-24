import { TrajectryPage } from "../../presentation/page/TrajectryPage";
import { HeaderContainer } from "./widgets/Header/Container";
import { ImagePanelContainer } from "./widgets/ImagePanel/Container";
import { MapAreaContainer } from "./widgets/MapArea/Container";
import { TrajectryDetailContainer } from "./widgets/TrajectryDetail/Container";
import { TrajectryHeightContainer } from "./widgets/TrajectryHeight/Container";
import { TrajectrySideBarContainer } from "./widgets/TrajectrySideBar/Container";
import { UploadModalContainer } from "./widgets/UploadModal/Container";
import { TrajectryPageStateProvider } from "./state/TrajectryPageStateProvider";

const TrajectryPageContainer = () => (
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

export default TrajectryPageContainer;
