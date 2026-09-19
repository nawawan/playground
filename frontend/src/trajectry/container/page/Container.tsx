import { TrajectryPage } from "../../presentation/page/TrajectryPage";
import { HeaderContainer } from "./widgets/Header/Container";
import { ImagePanelContainer } from "./widgets/ImagePanel/Container";
import { MapAreaContainer } from "./widgets/MapArea/Container";
import { TrajectryDetailContainer } from "./widgets/TrajectryDetail/Container";
import { TrajectryHeightContainer } from "./widgets/TrajectryHeight/Container";
import { TrajectrySideBarContainer } from "./widgets/TrajectrySideBar/Container";
import { UploadModalContainer } from "./widgets/UploadModal/Container";
import { TrajectryPageStateProvider } from "./state/TrajectryPageStateProvider";

type TrajectryPageContainerProps = {
  canUpload?: boolean;
};

const TrajectryPageContainer = ({ canUpload = false }: TrajectryPageContainerProps) => (
  <TrajectryPageStateProvider>
    <TrajectryPage
      Header={<HeaderContainer canUpload={canUpload} />}
      ImagePanel={<ImagePanelContainer />}
      MapArea={<MapAreaContainer />}
      TrajectryDetail={<TrajectryDetailContainer />}
      TrajectryHeight={<TrajectryHeightContainer />}
      TrajectrySideBar={<TrajectrySideBarContainer />}
      UploadModal={canUpload ? <UploadModalContainer /> : null}
    />
  </TrajectryPageStateProvider>
);

export default TrajectryPageContainer;
