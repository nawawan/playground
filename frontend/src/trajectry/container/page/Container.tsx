import { TrajectryPage } from "../../presentation/page/TrajectryPage";
import { HeaderContainer } from "./widgets/Header/Container";
import { ImagePanelContainer } from "./widgets/ImagePanel/Container";
import { MapAreaContainer } from "./widgets/MapArea/Container";
import { TrajectryDetailContainer } from "./widgets/TrajectryDetail/Container";
import { TrajectryHeightContainer } from "./widgets/TrajectryHeight/Container";
import { TrajectrySideBarContainer } from "./widgets/TrajectrySideBar/Container";
import { UploadModalContainer } from "./widgets/UploadModal/Container";
import { TrajectryPageStateProvider } from "./state/TrajectryPageStateProvider";
import { useTrajectryPageState } from "./state/useTrajectryPageState";

type TrajectryPageContainerProps = {
  canUpload?: boolean;
};

const TrajectryPageContent = ({ canUpload }: { canUpload: boolean }) => {
  const { activeActivity, loading } = useTrajectryPageState();
  const status = loading ? "loading" : activeActivity ? "ready" : "empty";

  return (
    <TrajectryPage
      Header={<HeaderContainer canUpload={canUpload} />}
      ImagePanel={<ImagePanelContainer />}
      MapArea={<MapAreaContainer />}
      TrajectryDetail={<TrajectryDetailContainer />}
      TrajectryHeight={<TrajectryHeightContainer />}
      TrajectrySideBar={<TrajectrySideBarContainer />}
      UploadModal={canUpload ? <UploadModalContainer /> : null}
      status={status}
    />
  );
};

const TrajectryPageContainer = ({ canUpload = false }: TrajectryPageContainerProps) => (
  <TrajectryPageStateProvider>
    <TrajectryPageContent canUpload={canUpload} />
  </TrajectryPageStateProvider>
);

export default TrajectryPageContainer;
