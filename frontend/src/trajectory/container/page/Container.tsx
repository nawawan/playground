import { TrajectoryPage } from "../../presentation/page/TrajectoryPage";
import { HeaderContainer } from "./widgets/Header/Container";
import { ImagePanelContainer } from "./widgets/ImagePanel/Container";
import { MapAreaContainer } from "./widgets/MapArea/Container";
import { TrajectoryDetailContainer } from "./widgets/TrajectoryDetail/Container";
import { TrajectoryHeightContainer } from "./widgets/TrajectoryHeight/Container";
import { TrajectorySideBarContainer } from "./widgets/TrajectorySideBar/Container";
import { UploadModalContainer } from "./widgets/UploadModal/Container";
import { TrajectoryPageStateProvider } from "./state/TrajectoryPageStateProvider";
import { useTrajectoryPageState } from "./state/useTrajectoryPageState";

type TrajectoryPageContainerProps = {
  canUpload?: boolean;
};

const TrajectoryPageContent = ({ canUpload }: { canUpload: boolean }) => {
  const { activeActivity, loading } = useTrajectoryPageState();
  const status = loading ? "loading" : activeActivity ? "ready" : "empty";

  return (
    <TrajectoryPage
      Header={<HeaderContainer canUpload={canUpload} />}
      ImagePanel={<ImagePanelContainer />}
      MapArea={<MapAreaContainer />}
      TrajectoryDetail={<TrajectoryDetailContainer />}
      TrajectoryHeight={<TrajectoryHeightContainer />}
      TrajectorySideBar={<TrajectorySideBarContainer canUpload={canUpload} />}
      UploadModal={canUpload ? <UploadModalContainer /> : null}
      status={status}
    />
  );
};

const TrajectoryPageContainer = ({ canUpload = false }: TrajectoryPageContainerProps) => (
  <TrajectoryPageStateProvider>
    <TrajectoryPageContent canUpload={canUpload} />
  </TrajectoryPageStateProvider>
);

export default TrajectoryPageContainer;
