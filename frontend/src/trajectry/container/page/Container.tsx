import { TrajectryPage } from "../../presentation/page/TrajectryPage";
import { useGenerateTrajectryPageProps } from "./useGenerateProps";

const TrajectryPageContainer = () => {
  const props = useGenerateTrajectryPageProps();

  return <TrajectryPage {...props} />;
};

export default TrajectryPageContainer;
